import sys
import gi
gi.require_version('Gst', '1.0')
import math
import queue
from common.is_aarch_64 import is_aarch64
from common.bus_call import bus_call
from common.FPS import PERF_DATA
import numpy as np
import csv
from datetime import datetime
import threading
from uuid import uuid4
import multiprocessing
import urllib.request
import matplotlib as mpl
from PIL import Image
import importlib
import uuid
import gi
import configparser
gi.require_version('Gst', '1.0')
from gi.repository import GLib, Gst
import pyds
import cv2
import os
from datetime import datetime, timedelta
import time
import json
from uuid import uuid4
import requests
import paramiko
import json
cwd = os.getcwd()
frame_count = {}
saved_count = {}
api_exec = {}
perf_data = None
obj_id_confidences = {}
frame_no = 0
padding = 5
q = queue.Queue()
processed_obj_ids = set()
dump_dict =  {}
face_data = {}
def saving_worker(save_queue):
    while True:
        item = save_queue.get()
        if item is None:
            print("Exiting saving worker.")
            break  # Exit signal received

        image_path, image = item
        # print(f"Saving image to {image_path}")
        cv2.imwrite(image_path, image)
        save_queue.task_done()
## queue process 
# Initialize the queue
save_queue = queue.Queue(maxsize=0) 
# Start the worker thread
worker_thread = threading.Thread(target=saving_worker, args=(save_queue,), daemon=True)
worker_thread.start()
def tiler_sink_pad_buffer_probe(pad, info, u_data):
    global frame_no, obj_id_confidences, obj_id, count
    gst_buffer = info.get_buffer()
    if not gst_buffer:
        print("Unable to get GstBuffer")
        return
    batch_meta = pyds.gst_buffer_get_nvds_batch_meta(hash(gst_buffer))
    l_frame = batch_meta.frame_meta_list
    while l_frame is not None:
        try:
            frame_meta = pyds.NvDsFrameMeta.cast(l_frame.data)
        except StopIteration:
            break
        obj_source_id = frame_meta.source_id
        img_save_path = f'person_image/{obj_source_id}/'
        os.makedirs(img_save_path, exist_ok=True)

        l_obj = frame_meta.obj_meta_list
        frame_no += 1
        n_frame = pyds.get_nvds_buf_surface(hash(gst_buffer), frame_meta.batch_id)
        
        while l_obj is not None:
            try:
                obj_meta = pyds.NvDsObjectMeta.cast(l_obj.data)
            except StopIteration:
                break

            obj_id, confidence = obj_meta.object_id, obj_meta.confidence
            x, y = obj_meta.rect_params.left, obj_meta.rect_params.top
            bbox_width, bbox_height = obj_meta.rect_params.width, obj_meta.rect_params.height
            x1, y1 = max(int(x - padding), 0), max(int(y - padding), 0)
            x2, y2 = int(x + bbox_width + padding), int(y + bbox_height + padding)

            # Initialize obj_id_confidences and last_save_time if the object is new
            if obj_id not in obj_id_confidences:
                obj_id_confidences[obj_id] = {'confidences': [confidence], 'exec': False, 'uuid': uuid4().hex}

            else:
                obj_id_confidences[obj_id]['confidences'].append(confidence)

            current_time = time.time()  # Get the current time in seconds
            original_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            # Save frame if confidence is >= 0.25 and not already executed
            if confidence >= 0.25 and not obj_id_confidences[obj_id]['exec']:
                current_confidence = obj_id_confidences[obj_id]['confidences'][-1]
                img_file_name = f"{obj_id_confidences[obj_id]['uuid']}_{round(confidence, 2)}_{original_time}.jpg"
                frame = np.array(n_frame, copy=True, order='C')
                bgr_frame = cv2.cvtColor(frame, cv2.COLOR_RGBA2BGR)
                cropped_image = bgr_frame[y1:y2, x1:x2]
                full_image_path = os.path.join(img_save_path, img_file_name)
                save_queue.put((full_image_path, cropped_image))
                if len(obj_id_confidences[obj_id]['confidences']) >= 5:
                    obj_id_confidences[obj_id]['exec'] = True
            try:
                l_obj = l_obj.next
            except StopIteration:
                break
        
        stream_index = f"stream{frame_meta.pad_index}"
        global perf_data
        perf_data.update_fps(stream_index)

        try:
            l_frame = l_frame.next
        except StopIteration:
            break

    return Gst.PadProbeReturn.OK


def cb_newpad(decodebin, decoder_src_pad, data):
    print("In cb_newpad\n")
    caps = decoder_src_pad.get_current_caps()
    gststruct = caps.get_structure(0)
    gstname = gststruct.get_name()
    source_bin = data
    features = caps.get_features(0)
    if (gstname.find("video") != -1):
        if features.contains("memory:NVMM"):
            bin_ghost_pad = source_bin.get_static_pad("src")
            if not bin_ghost_pad.set_target(decoder_src_pad):
                sys.stderr.write("Failed to link decoder src pad to source bin ghost pad\n")
        else:
            sys.stderr.write(" Error: Decodebin did not pick nvidia decoder plugin.\n")

def decodebin_child_added(child_proxy, Object, name, user_data):
    print("Decodebin child added:", name, "\n")
    if name.find("decodebin") != -1:
        Object.connect("child-added", decodebin_child_added, user_data)
    if not is_aarch64() and name.find("nvv4l2decoder") != -1:
        Object.set_property("cudadec-memtype", 2)
    if "source" in name:
        source_element = child_proxy.get_by_name("source")
        if source_element.find_property('drop-on-latency') != None:
            Object.set_property("drop-on-latency", True)

def create_source_bin(index, uri):
    # print("Creating source bin")
    bin_name = "source-bin-%02d" % index
    # print(bin_name)
    nbin = Gst.Bin.new(bin_name)
    if not nbin:
        sys.stderr.write(" Unable to create source bin \n")
    uri_decode_bin = Gst.ElementFactory.make("uridecodebin", "uri-decode-bin") 
    if not uri_decode_bin:
        sys.stderr.write(" Unable to create uri decode bin \n")
    uri_decode_bin.set_property("uri", uri)
    uri_decode_bin.connect("pad-added", cb_newpad, nbin)
    uri_decode_bin.connect("child-added", decodebin_child_added, nbin)
    Gst.Bin.add(nbin, uri_decode_bin)
    bin_pad = nbin.add_pad(Gst.GhostPad.new_no_target("src", Gst.PadDirection.SRC))
    if not bin_pad:
        sys.stderr.write(" Failed to add ghost pad in source bin \n")
        return None
    return nbin
def main():
    args = ['rtsp://admin:Sieora123@192.168.1.64:554' ]
    global perf_data
    perf_data = PERF_DATA(len(args))
    number_sources = len(args)
    Gst.init(None)
    print("Creating Pipeline \n ")
    pipeline = Gst.Pipeline()
    if not pipeline:
        sys.stderr.write(" Unable to create Pipeline \n")
    is_live = False
    print("Adding queues to the Pipeline \n")
    print("Creating streamux \n ")
    # INPUT_WIDTH, INPUT_HIGHT = 3840, 2160
    INPUT_WIDTH, INPUT_HIGHT = 1920, 1080
    streammux = Gst.ElementFactory.make("nvstreammux", "Stream-muxer")
    if not streammux:
        sys.stderr.write(" Unable to create NvStreamMux \n")
    streammux.set_property('width', INPUT_WIDTH)
    streammux.set_property('height', INPUT_HIGHT)
    streammux.set_property('batch-size', number_sources)
    streammux.set_property('batched-push-timeout', 400000)
    pipeline.add(streammux)

    queue1 = Gst.ElementFactory.make("queue", "queue1")   ########
    pipeline.add(queue1)   ########
    streammux.link(queue1)   ########

    for i in range(number_sources):
        print("Creating source_bin ", i, " \n ")
        uri_name = args[i]
        if uri_name.find("rtsp://") == 0:
            is_live = False
        source_bin = create_source_bin(i, uri_name)
        if not source_bin:
            sys.stderr.write("Unable to create source bin \n")
        pipeline.add(source_bin)
        padname = "sink_%u" % i
        sinkpad = streammux.get_request_pad(padname)
        if not sinkpad:
            sys.stderr.write("Unable to create sink pad bin \n")
        srcpad = source_bin.get_static_pad("src")
        if not srcpad:
            sys.stderr.write("Unable to create src pad bin \n")
        srcpad.link(sinkpad)    

    print("Creating Pgie \n ")
    pgie = Gst.ElementFactory.make("nvinfer", "primary-inference")
    if not pgie:
        sys.stderr.write(" Unable to create pgie \n")
    pgie.set_property('config-file-path', "config_infer_primary_yoloV8.txt")
    pgie_batch_size = pgie.get_property("batch-size")
    if (pgie_batch_size != number_sources):
        print("WARNING: Overriding infer-config batch-size", pgie_batch_size, " with number of sources ",
              number_sources, " \n")
        # pgie.set_property("batch-size", number_sources)
    pipeline.add(pgie)   ########
    queue1.link(pgie)   ########
    
    queue2 = Gst.ElementFactory.make("queue", "queue2")   ########
    pipeline.add(queue2)   ########
    pgie.link(queue2)   ########

    print("Creating nvtracker \n ")
    tracker = Gst.ElementFactory.make("nvtracker", "tracker")
    if not tracker:
        sys.stderr.write(" Unable to create tracker \n")

    config = configparser.ConfigParser()
    config.read('dsnvanalytics_tracker_config.txt')
    config.sections()

    for key in config['tracker']:
        if key == 'tracker-width' :
            tracker_width = config.getint('tracker', key)
            tracker.set_property('tracker-width', tracker_width)
        if key == 'tracker-height' :
            tracker_height = config.getint('tracker', key)
            tracker.set_property('tracker-height', tracker_height)
        if key == 'gpu-id' :
            tracker_gpu_id = config.getint('tracker', key)
            tracker.set_property('gpu_id', tracker_gpu_id)
        if key == 'll-lib-file' :
            tracker_ll_lib_file = config.get('tracker', key)
            tracker.set_property('ll-lib-file', tracker_ll_lib_file)
        if key == 'll-config-file' :
            tracker_ll_config_file = config.get('tracker', key)
            tracker.set_property('ll-config-file', tracker_ll_config_file)
        if key == 'enable-batch-process' :
            tracker_enable_batch_process = config.getint('tracker', key)
        if key == 'enable-past-frame' :
            tracker_enable_past_frame = config.getint('tracker', key)
            tracker.set_property('enable_past_frame', tracker_enable_past_frame)
    pipeline.add(tracker)   ########
    queue2.link(tracker)   ########
    
    queue3 = Gst.ElementFactory.make("queue", "queue3")   ########
    pipeline.add(queue3)   ########
    tracker.link(queue3)   ########

    print("Creating nvvidconv1 \n ")
    nvvidconv1 = Gst.ElementFactory.make("nvvideoconvert", "convertor1")
    if not nvvidconv1:
        sys.stderr.write(" Unable to create nvvidconv1 \n")
    pipeline.add(nvvidconv1)   ########
    queue3.link(nvvidconv1)
    
    queue4 = Gst.ElementFactory.make("queue", "queue4")   ########
    pipeline.add(queue4)   ########
    nvvidconv1.link(queue4)
        
    print("Creating filter1 \n ")
    caps1 = Gst.Caps.from_string("video/x-raw(memory:NVMM), format=RGBA")
    filter1 = Gst.ElementFactory.make("capsfilter", "filter1")
    if not filter1:
        sys.stderr.write(" Unable to get the caps filter1 \n")
    filter1.set_property("caps", caps1)
    pipeline.add(filter1)   ########
    queue4.link(filter1)   ########

    print("Creating tiler \n ")
    TILED_OUTPUT_WIDTH = 1920
    TILED_OUTPUT_HEIGHT = 1080
    tiler = Gst.ElementFactory.make("nvmultistreamtiler", "nvtiler")
    if not tiler:
        sys.stderr.write(" Unable to create tiler \n")
    tiler_rows = int(math.sqrt(number_sources))
    tiler_columns = int(math.ceil((1.0 * number_sources) / tiler_rows))
    tiler.set_property("rows", tiler_rows)
    tiler.set_property("columns", tiler_columns)
    tiler.set_property("width", TILED_OUTPUT_WIDTH)
    tiler.set_property("height", TILED_OUTPUT_HEIGHT)
    pipeline.add(tiler)   ########
    filter1.link(tiler)   ########

    print("Creating nvosd \n ")
    nvosd = Gst.ElementFactory.make("nvdsosd", "onscreendisplay")
    if not nvosd:
        sys.stderr.write(" Unable to create nvosd \n")
    pipeline.add(nvosd)   ########
    tiler.link(nvosd)   #######

    print("Creating nv3dsink \n")
    sink = Gst.ElementFactory.make("nv3dsink", "nv3d-sink") # nvoverlaysink
    sink.set_property("sync",0)
    sink.set_property("qos",0)
    # sink.set_property("overlay-w", 640)
    # sink.set_property("overlay-h", 0)
    if not sink:
        sys.stderr.write(" Unable to create fakesink \n")
    pipeline.add(sink)   ########
    nvosd.link(sink)   ########
    
    if is_live:
        print("Atleast one of the sources is live")
        streammux.set_property('live-source', 1)
    loop = GLib.MainLoop()
    bus = pipeline.get_bus()
    bus.add_signal_watch()
    bus.connect("message", bus_call, loop)

    tiler_sink_pad = tiler.get_static_pad("sink")
    if not tiler_sink_pad:
        sys.stderr.write(" Unable to get src pad \n")
    else:
        tiler_sink_pad.add_probe(Gst.PadProbeType.BUFFER, tiler_sink_pad_buffer_probe, 0)
        GLib.timeout_add(5000, perf_data.perf_print_callback)

    print("Now playing...")
    for i, source in enumerate(args[:-1]):
        if i != 0:
            print(i, ": ", source)
    print("Starting pipeline \n")
    pipeline.set_state(Gst.State.PLAYING)
    try:
        loop.run()
    except:
        pass
    print("Exiting app\n")
    pipeline.set_state(Gst.State.NULL)

if __name__ == '__main__':
    sys.exit(main())

