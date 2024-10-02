import React from 'react';
import { Col } from 'react-bootstrap'; // Import Col from react-bootstrap for layout
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function TableSkeleton({ numRows,show }) {
  return (
    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ overflowX: 'scroll', minHeight: show ? '20vh' : '80vh' ,padding:5,backgroundColor:'white' }}>
      <table style={{ width: '100%', backgroundColor: 'white' }}>
        {
          show !=true ?
          <thead>
          <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
            <th style={{ padding: '15px' }}><Skeleton width={150} /></th>
            <th style={{ padding: '15px' }}><Skeleton width={150} /></th>
            <th style={{ padding: '15px' }}><Skeleton width={150} /></th>
            <th style={{ padding: '15px' }}><Skeleton width={150} /></th>
            <th style={{ padding: '15px' }}><Skeleton width={150} /></th>
           
            
          </tr>
        </thead>
        :''

        }
    
        <tbody>
          {/* Generate skeleton rows */}
          {Array(numRows).fill(0).map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: '1px solid grey', color: 'black', width : '100%' }}>
              <td style={{ padding: '15px' }}>
                <Skeleton width={120} />
              </td>
              <td style={{ padding: '15px' }}>
                <Skeleton width={120} />
              </td>
              <td style={{ padding: '15px' }}>
                <Skeleton width={120} />
              </td>
              <td style={{ padding: '15px' }}>
                <Skeleton width={120} />
              </td>
              <td style={{ padding: '15px' }}>
                <Skeleton width={120} />
              </td>
             
              
              
            </tr>
          ))}
        </tbody>
      </table>
    </Col>
  );
}

export default TableSkeleton;
