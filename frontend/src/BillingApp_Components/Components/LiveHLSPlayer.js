import React, { useState, useEffect } from 'react';

import { forwardRef } from "react";
import ReactPlayer from 'react-player/file';
import PropTypes from 'prop-types';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
// Sets up ReactPlayer for live stream
const LivePlayer = forwardRef(
    (
        {
            url,
            onError = console.error,
            ...props
        },
        ref
    ) => {
        return (
            <ReactPlayer
                
                ref={ref}
                url={url}
                width="100%"
                height={"100%"}
                playing
                volume={0}
                muted
                playsinline // Needed to autoplay on iOS Safari
                controls={props.control}
                // onBufferEnd={()=>alert("sdkfh")}
                onError={onError}
                config={{
                    file: {

                        // Safari handles HLS outside ReactPlayer
                        forceHLS: !isSafari,

                        // Not sure if this still applies?
                        // Will need to include this once Rob has made backend change (see his message to me from 11:55 23/11)
                        // And when we do, we can ditch userToken from url above
                        hlsOptions: {
                            // xhrSetup: xhr => {
                            //     xhr.setRequestHeader('Authorization', `ManythingToken ${token}`)
                            // }
                            "backBufferLength": 0
                        },
                        
                        hlsVersion: '1.2.0'
                    },
                }}
                {...props}
                
            />
            
        );
    }
);

LivePlayer.propTypes = {
    /** Live stream URL. */
    url: PropTypes.string.isRequired,
};

export default LivePlayer;