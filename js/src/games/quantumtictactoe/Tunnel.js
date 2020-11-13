import './Tunnel.scss';
import React, {useEffect, useState} from 'react';


let particleSizePx = 64;


/**
 * props:
 *   containerBoundingClientRect
 *   boundingClientRects - a 2-element array
 *   playerStyle
 *   resolvePct
 *   symbol
 *   highlight
 */
const Tunnel = props => {

  const [lineStyle, setLineStyle] = useState(null);
  const [particle1Style, setParticle1Style] = useState(null);
  const [particle2Style, setParticle2Style] = useState(null);
  const [particle3Style, setParticle3Style] = useState(null);

  useEffect(() => {
    if (!props.boundingClientRects ||
        !props.containerBoundingClientRect ||
        props.boundingClientRects.length !== 2 ||
        !props.boundingClientRects[0] ||
        !props.boundingClientRects[1]) {
      setLineStyle(null);
      setParticle1Style(null);
      setParticle2Style(null);
      return;
    }
    let relRect = props.containerBoundingClientRect;
    let fromRect = props.boundingClientRects[0];
    let toRect = props.boundingClientRects[1];
    let fromX = fromRect.left + fromRect.width / 2;
    let fromY = fromRect.top + fromRect.height / 2;
    let toX = toRect.left + toRect.width / 2;
    let toY = toRect.top + toRect.height / 2;
    let dX = fromX - toX;
    let dY = fromY - toY;
    let mirror = fromY > toY ? Math.PI : 0;
    let lineLeft = fromX - relRect.left - 2;
    let lineTop = fromY - relRect.top - 2;
    let lineLength = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    let lineAngle = dY ? -Math.atan(dX / dY) + mirror : -Math.PI / 2;
    setLineStyle({
      top: lineTop, left: lineLeft, height: lineLength,
      transform: `rotate(${lineAngle}rad)`,
    });
    setParticle1Style({
      top: fromY - relRect.top - particleSizePx / 2,
      left: fromX - relRect.left - particleSizePx / 2,
    });
    setParticle2Style({
      top: toY - relRect.top - particleSizePx / 2,
      left: toX - relRect.left - particleSizePx / 2,
    });
  }, [props.containerBoundingClientRect, props.boundingClientRects]);

  useEffect(() => {
    if (props.resolvePct === undefined || !particle1Style || !particle2Style) {
      setParticle3Style(null);
      return;
    }
    let dX = particle2Style.left - particle1Style.left;
    let dY = particle2Style.top - particle1Style.top;
    setParticle3Style({
      top: particle1Style.top + dY * props.resolvePct / 100,
      left: particle1Style.left + dX * props.resolvePct / 100,
    });
  }, [particle1Style, particle2Style, props.resolvePct,
      props.containerBoundingClientRect]);

  return (
    <div className={`
            Tunnel ${props.playerStyle}
            ${props.resolvePct !== null ? 'resolving' : null}
        `}>
      <div
          className={`particle value ${props.highlight ? 'highlight' : null}`}
          style={particle1Style}>
        {props.symbol}
      </div>
      <div 
          className={`particle value ${props.highlight ? 'highlight' : null}`}
          style={particle2Style}>
        {props.symbol}
      </div>
      <div className='particle particle3 value' style={particle3Style}>
        {props.symbol}
      </div>
      <div className='line' style={lineStyle}>
        <div className='lineInner' />
      </div>
    </div>
  );
};


export default Tunnel;

