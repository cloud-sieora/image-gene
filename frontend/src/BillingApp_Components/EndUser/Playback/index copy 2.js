import React from 'react'

export default function index() {
  return (
    <div style={{ border: '1px solid black', display: 'inline-block', borderRadius: '5px', padding: '5px' }}>
      <div>
        <p style={{ margin: 0 }}>Your plan</p>
        <div>
          <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px' }}>
            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
              <p style={{ padding: '5px', margin: 0, }}>2 mp cameras</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
              <div style={{ marginRight: '10px' }}>
                <p style={{ margin: 0 }}>Motion triggered</p>
                <p style={{ margin: 0 }}>24/Continuous</p>
              </div>
              <div>
                <p style={{ margin: 0 }}>0 B 0</p>
                <p style={{ margin: 0 }}>0 B 0</p>
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px' }}>
            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
              <p style={{ padding: '5px', margin: 0, }}>4 mp cameras</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
              <div style={{ marginRight: '10px' }}>
                <p style={{ margin: 0 }}>Motion triggered</p>
                <p style={{ margin: 0 }}>24/Continuous</p>
              </div>
              <div>
                <p style={{ margin: 0 }}>0 B 0</p>
                <p style={{ margin: 0 }}>0 B 0</p>
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white' }}>
            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
              <p style={{ padding: '5px', margin: 0, }}>8 mp cameras</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
              <div style={{ marginRight: '10px' }}>
                <p style={{ margin: 0 }}>Motion triggered</p>
                <p style={{ margin: 0 }}>24/Continuous</p>
              </div>
              <div>
                <p style={{ margin: 0 }}>0 B 0</p>
                <p style={{ margin: 0 }}>0 B 0</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid grey', borderRadius: '5px', color: 'black', backgroundColor: 'white', marginTop: '5px' }}>
          <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
            <p style={{ padding: '5px', margin: 0, }}>Other Subscription</p>
          </div>
          <div style={{ display: 'flex', padding: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <div style={{ marginRight: '10px' }}>
                <p style={{ margin: 0 }}>Alert</p>
                <p style={{ margin: 0 }}>Analytic</p>
              </div>
              <div>
                <p style={{ margin: 0 }}>0 B 0</p>
                <p style={{ margin: 0 }}>0 B 0</p>
              </div>
            </div>

            <div style={{ display: 'flex', width: '50%' }}>
              <div style={{ marginRight: '10px' }}>
                <p style={{ margin: 0 }}>Face Detaction</p>
              </div>
              <div>
                <p style={{ margin: 0 }}>0 B 0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
