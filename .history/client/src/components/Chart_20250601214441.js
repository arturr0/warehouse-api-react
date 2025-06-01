import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const Chart = ({ products }) => {
  const sketchRef = useRef();
  
  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(800, 580);
      };

      p.draw = () => {
        p.background(15, 32, 45);
        p.fill(29, 185, 157);
        p.noStroke();
        
        if (products.length > 0) {
          const maxQty = Math.max(...products.map(prod => prod.quantity), 10);
          
          products.forEach((prod, i) => {
            const barWidth = 70;
            const spacing = 20;
            const x = i * (barWidth + spacing) + 50;
            const barHeight = p.map(prod.quantity, 0, maxQty, 0, 400);
            
            // Bar
            p.rect(x, 500 - barHeight, barWidth, barHeight, 5);
            
            // Labels
            p.fill(255);
            p.textSize(16);
            p.textAlign(p.CENTER);
            p.text(`ID: ${prod._id}`, x + barWidth/2, 520);
            p.text(prod.name, x + barWidth/2, 545);
            p.text(`Qty: ${prod.quantity}`, x + barWidth/2, 570);
            p.fill(29, 185, 157);
          });
        } else {
          p.fill(255);
          p.textSize(24);
          p.textAlign(p.CENTER);
          p.text("No products to display", p.width/2, p.height/2);
        }
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, [products]);

  return <div ref={sketchRef} />;
};

export default Chart;