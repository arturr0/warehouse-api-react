import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const Chart = ({ products }) => {
  const sketchRef = useRef();
  const [p5Instance, setP5Instance] = useState(null);

  useEffect(() => {
    // Initialize sketch only once
    if (!p5Instance) {
      const sketch = (p) => {
        let currentProducts = [...products];

        p.setup = () => {
          p.createCanvas(800, 580);
        };

        p.draw = () => {
          p.background(15, 32, 45);
          p.fill(29, 185, 157);
          p.noStroke();

          if (currentProducts.length > 0) {
            const maxQty = Math.max(...currentProducts.map(prod => prod.quantity), 10);

            currentProducts.forEach((prod, i) => {
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
              //p.text(`ID: ${prod.id}`, x + barWidth / 2, 520);
              p.text(prod.name, x + barWidth / 2, 545);
              p.text(`Qty: ${prod.quantity}`, x + barWidth / 2, 570);
              p.fill(29, 185, 157);
            });
          } else {
            p.fill(255);
            p.textSize(24);
            p.textAlign(p.CENTER);
            p.text("No products to display", p.width / 2, p.height / 2);
          }
        };

        // Update function for new products
        p.updateProducts = (newProducts) => {
          currentProducts = [...newProducts];
          p.redraw();
        };
      };

      const instance = new p5(sketch, sketchRef.current);
      setP5Instance(instance);
    }
  }, [p5Instance, products]);

  // Update products in the sketch without reinitializing
  useEffect(() => {
    if (p5Instance && p5Instance.updateProducts) {
      p5Instance.updateProducts(products);
    }
  }, [products, p5Instance]);

  return <div ref={sketchRef} />;
};

export default Chart;
