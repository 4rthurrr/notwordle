import React, { useEffect, useRef } from 'react';
import './Confetti.css';

function Confetti() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create confetti particles
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                   '#2196f3', '#03a9f4', '#00bcd4', '#4caf50', '#8bc34a', '#ffeb3b', '#ffc107'];
                   
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 10 + 5;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * 6;
        this.spin = Math.random() < 0.5 ? -1 : 1;
        this.rotate = Math.random() * 360;
        this.rotateSpeed = Math.random() * 2;
        this.fallSpeed = Math.random() * 2 + 1;
        this.opacity = 1;
      }
      
      update() {
        this.y += this.fallSpeed;
        this.angle += 0.01 * this.spin;
        this.rotate += this.rotateSpeed;
        this.x += Math.cos(this.angle) * this.speed;
        
        // Fade out particles as they reach the bottom
        if (this.y > canvas.height * 0.7) {
          this.opacity -= 0.01;
        }
        
        // Remove if below screen or faded out
        if (this.y > canvas.height || this.opacity <= 0) {
          const index = particles.indexOf(this);
          if (index !== -1) {
            particles.splice(index, 1);
          }
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }
    
    // Initialize particles
    function init() {
      for (let i = 0; i < 200; i++) {
        setTimeout(() => {
          particles.push(new Particle());
        }, i * 20);
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Continue animation if particles remain
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    }
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    init();
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="confetti-canvas"></canvas>;
}

export default Confetti;
