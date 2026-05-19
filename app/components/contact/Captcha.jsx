import { useEffect, useRef } from "react";

const Captcha = ({ onCaptchaGenerated }) => {
  const canvasRef = useRef(null);

  const getRandomNumber = () => Math.floor(Math.random() * 26) + 6;

  const generateCaptcha = () => {
    const num1 = getRandomNumber();
    const num2 = getRandomNumber();
    const answer = num1 + num2;
    const question = `${num1} + ${num2}`;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 40;

    // Set the background color to green
    context.fillStyle = "#f17005";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "16px Arial";
    context.fillStyle = "white"; // Text color

    // Measure the text width and height
    const textWidth = context.measureText(question).width;
    const textHeight = 20; // You can adjust this based on your font size

    // Calculate x and y to center the text
    const x = (canvas.width - textWidth) / 2;
    const y = (canvas.height + textHeight / 2) / 2; // Adjust y for vertical centering

    context.fillText(question, x, y);
    onCaptchaGenerated(answer);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={generateCaptcha} className="text-xs text-primary">
        Refresh Captcha
      </button>
    </div>
  );
};

export default Captcha;
