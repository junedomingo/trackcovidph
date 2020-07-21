import React, { useCallback, useRef, useState, useEffect, memo } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';

import { useConfirmedLocalsQuery } from '../../graphql';
import { generateDataset } from './utils';

const PopOver = ({
  detail,
  patients,
  position,
}: {
  detail: string | null;
  patients: any;
  position: {
    x: number;
    y: number;
  };
}) => {
  const patient = patients.find((patient: any) => patient.case_id === detail);
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 1,
        width: 200,
      }}
    >
      {detail || 'Hello June'}
      {JSON.stringify(patient)}
    </div>
  );
};

export const ContagionGraph = memo(() => {
  const fgRef = useRef() as React.MutableRefObject<ForceGraphMethods>;
  const [detail, setDetail] = useState('');
  const [graphData, setgraphData] = useState();
  const [show, setshow] = useState(false);
  const [position, setposition] = useState({ x: 100, y: 100 });

  const handleClick = useCallback(
    (node) => {
      console.log(node);
      setDetail(node.id);
      // setshow(true);
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(8, 2000);
      setposition({
        x: node.x,
        y: node.y,
      });
    },
    [fgRef]
  );

  const { loading, error, data } = useConfirmedLocalsQuery();

  useEffect(() => {
    if (data) {
      const genData = generateDataset(data.confirmedLocals);
      //@ts-ignore
      setgraphData(genData);
    }
  }, [data]);

  if (loading) return <p>loading</p>;
  if (error) return <p>error: {error.message}</p>;

  if (data && graphData) {
    const elem = document.getElementById('root');
    return (
      <div className="container">
        {show && <PopOver detail={detail} position={position} patients={data.confirmedLocals} />}
        <ForceGraph2D
          ref={fgRef}
          onNodeClick={handleClick}
          graphData={graphData}
          nodeAutoColorBy="group"
          linkCurvature={0.1}
          onNodeHover={(node) => (elem!.style.cursor = node ? 'pointer' : '')}
          onBackgroundClick={() => {
            setshow(false);
          }}
          onZoomEnd={({ k, x, y }) => {
            console.log(x, y);
            // setposition({
            //   x: position.x,
            //   y: position.y,
            // });

            if (k > 7) {
              setshow(true);
            } else if (show && k < 7) {
              // setshow(false);
            }
          }}
          // onNodeHover={(node) => (elem.style.cursor = node ? 'pointer' : null)}
          // linkDirectionalParticles={1}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id as string;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(
              (node.x as number) - bckgDimensions[0] / 2,
              (node.y as number) - bckgDimensions[1] / 2,
              bckgDimensions[0],
              bckgDimensions[1]
            );

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            //@ts-ignore
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x as number, node.y as number);
          }}
        />
      </div>
    );
  }

  return <p>No data</p>;
});
