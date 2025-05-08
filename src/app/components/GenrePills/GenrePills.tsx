"use client";

import { useEffect, useRef, useState } from "react";
import Matter, {
  Bodies,
  Body,
  Engine,
  Render,
  Runner,
  World,
  Mouse,
  MouseConstraint,
  Events,
} from "matter-js";
import styles from "./GenrePills.module.css";

// List of music genres to display in pills
const musicGenres = [
  // Main genres
  "Rock",
  "Jazz",
  "Hip Hop",
  "Electronic",
  "Pop",
  "Classical",
  "R&B",
  "Reggae",
  "Metal",
  "Funk",
  "Country",
  "Blues",
  "Techno",
  "Soul",
  "Disco",
  "Folk",
  "Indie",
  "Punk",
  "Ambient",
  "Trap",

  // Electronic subgenres
  "House",
  "Dubstep",
  "Trance",
  "Drum & Bass",
  "Synthwave",
  "Electro",
  "EDM",
  "Lo-fi",
  "Breakbeat",
  "Hardstyle",
  "Garage",
  "Chillwave",

  // Rock/Metal subgenres
  "Alternative",
  "Grunge",
  "Prog Rock",
  "Psychedelic",
  "Hard Rock",
  "Heavy Metal",
  "Thrash",
  "Death Metal",
  "Black Metal",
  "Nu Metal",
  "Metalcore",
  "Shoegaze",

  // Hip Hop subgenres
  "Old School",
  "Trap",
  "Mumble Rap",
  "Drill",
  "Abstract",
  "East Coast",
  "West Coast",
  "Southern",
  "UK Grime",
  "Conscious",
  "Boom Bap",
  "Cloud Rap",

  // Jazz subgenres
  "Bebop",
  "Swing",
  "Fusion",
  "Free Jazz",
  "Modal",
  "Cool Jazz",
  "Big Band",
  "Dixieland",

  // World music
  "Afrobeat",
  "Latin",
  "K-Pop",
  "J-Pop",
  "Bossa Nova",
  "Salsa",
  "Samba",
  "Flamenco",
  "Celtic",
  "Bollywood",
  "Afro Cuban",
  "Calypso",

  // Eclectic genres
  "Post-Rock",
  "Math Rock",
  "Noise",
  "Vaporwave",
  "Trip Hop",
  "IDM",
  "Glitch",
  "Industrial",
  "Neo-Soul",
  "Post-Punk",
  "New Wave",
  "Emo",
];

// Random color generator for pills
const getRandomColor = () => {
  const colors = [
    "#ff2e2e99",
    "#3babf0cc",
    "#FFD166cc",
    "#24a07fcc",
    "#118AB2cc",
    "#bb7a20cc",
    "#6A0572cc",
    "#AB83A1cc",
    "#ec36d4cc",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface GenrePillsProps {
  className?: string;
  isVisible?: boolean;
}

export function GenrePills({
  className = "",
  isVisible = false,
}: GenrePillsProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const pillsRef = useRef<Matter.Body[]>([]);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize Matter.js
  useEffect(() => {
    if (!sceneRef.current) return;

    // Setup Matter.js
    const engine = Engine.create({
      gravity: { x: 0, y: 0, scale: 0.001 }, // Start with no gravity
    });
    engineRef.current = engine;

    const container = sceneRef.current;
    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;
    canvasRef.current = render.canvas;

    // Add mouse control for dragging
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engine.world, mouseConstraint);

    // Sync mouse with render
    render.mouse = mouse;

    // Add walls to keep pills inside the viewport
    const wallOptions = {
      isStatic: true,
      render: { visible: false },
    };

    // All four walls - top, bottom, left, right
    const walls = [
      // Top wall (just above viewport)
      Bodies.rectangle(
        container.clientWidth / 2,
        -50,
        container.clientWidth * 1.5,
        100,
        wallOptions
      ),
      // Bottom wall
      Bodies.rectangle(
        container.clientWidth / 2,
        container.clientHeight + 50,
        container.clientWidth * 1.5,
        100,
        wallOptions
      ),
      // Left wall
      Bodies.rectangle(
        -50,
        container.clientHeight / 2,
        100,
        container.clientHeight * 1.5,
        wallOptions
      ),
      // Right wall
      Bodies.rectangle(
        container.clientWidth + 50,
        container.clientHeight / 2,
        100,
        container.clientHeight * 1.5,
        wallOptions
      ),
    ];

    World.add(engine.world, walls);

    // Create a composite structure for each pill with a fixed text label
    const createPill = (
      x: number,
      y: number,
      genre: string,
      sizeVariation: number
    ) => {
      // Calculate dimensions based on text
      const pillWidth = Math.max(100, genre.length * 10) * sizeVariation;
      const pillHeight = 36 * sizeVariation;
      const color = getRandomColor();

      // Create pill as a capsule shape
      const pill = Bodies.rectangle(x, y, pillWidth, pillHeight, {
        chamfer: { radius: pillHeight / 2 },
        restitution: 0.5,
        friction: 0.2,
        frictionAir: 0.02,
        render: {
          fillStyle: color,
        },
        // Store genre as a property
        label: genre,
      });

      return pill;
    };

    // Position pills with chaotic horizontal distribution but more uniform height
    const addPills = () => {
      const containerWidth = container.clientWidth;

      // Chaotic horizontal distribution
      musicGenres.forEach((genre) => {
        // Randomize x position across full width with some overflow
        const xPos =
          Math.random() * containerWidth * 1.2 - containerWidth * 0.1;

        // All pills start at roughly similar heights
        // Small variation to prevent exact alignment
        const yPos = -300 - Math.random() * 100;

        // More varied pill sizes
        const sizeVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        const pill = createPill(xPos, yPos, genre, sizeVariation);

        // Pre-rotate some pills for more randomness
        Body.setAngle(pill, Math.random() * Math.PI * 2);

        // Add some initial angular velocity
        Body.setAngularVelocity(pill, (Math.random() - 0.5) * 0.05);

        pillsRef.current.push(pill);
        World.add(engine.world, pill);
      });
    };

    addPills();

    // Constrain bodies to bounds if they go outside
    const constrainBodies = () => {
      const padding = 20; // padding to ensure text remains visible

      pillsRef.current.forEach((pill) => {
        const { x, y } = pill.position;
        const halfWidth = pill.bounds.max.x - pill.bounds.min.x;
        const halfHeight = pill.bounds.max.y - pill.bounds.min.y;

        // Check boundaries
        if (x < halfWidth / 2 + padding) {
          Body.setPosition(pill, { x: halfWidth / 2 + padding, y });
          Body.setVelocity(pill, { x: 0, y: pill.velocity.y });
        }
        if (x > container.clientWidth - halfWidth / 2 - padding) {
          Body.setPosition(pill, {
            x: container.clientWidth - halfWidth / 2 - padding,
            y,
          });
          Body.setVelocity(pill, { x: 0, y: pill.velocity.y });
        }
        if (y < halfHeight / 2 + padding) {
          Body.setPosition(pill, { x, y: halfHeight / 2 + padding });
          Body.setVelocity(pill, { x: pill.velocity.x, y: 0 });
        }
        if (y > container.clientHeight - halfHeight / 2 - padding) {
          Body.setPosition(pill, {
            x,
            y: container.clientHeight - halfHeight / 2 - padding,
          });
          Body.setVelocity(pill, { x: pill.velocity.x, y: 0 });
        }
      });
    };

    // Add after-update event for constraints
    Events.on(engine, "afterUpdate", constrainBodies);

    // Create the runner but don't start it yet
    const runner = Runner.create();
    runnerRef.current = runner;

    // Only start the renderer, not the physics yet
    Render.run(render);

    // Draw text consistently on pill bodies
    function drawGenreText() {
      if (!canvasRef.current) return;
      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      // Configure text style for better readability
      context.font = "12px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.lineWidth = 2;

      pillsRef.current.forEach((pill) => {
        const genre = pill.label;
        if (!genre) return;

        // Get pill position and angle
        const { x, y } = pill.position;
        const angle = pill.angle;

        // Save current canvas state
        context.save();

        // Translate and rotate context to match pill
        context.translate(x, y);
        context.rotate(angle);

        // Add text outline for better visibility
        context.strokeStyle = "rgba(0, 0, 0, 0.5)";
        context.strokeText(genre as string, 0, 0);

        // Add text fill
        context.fillStyle = "#fff";
        context.fillText(genre as string, 0, 0);

        // Restore canvas state
        context.restore();
      });

      requestAnimationFrame(drawGenreText);
    }

    drawGenreText();

    // Mark as initialized
    setInitialized(true);

    // Handle window resize
    const handleResize = () => {
      if (!container || !render) return;

      // Update canvas dimensions
      render.options.width = container.clientWidth;
      render.options.height = container.clientHeight;
      render.canvas.width = container.clientWidth;
      render.canvas.height = container.clientHeight;

      // Update wall positions
      if (walls[0]) {
        Body.setPosition(walls[0], {
          x: container.clientWidth / 2,
          y: -50,
        });
      }

      if (walls[1]) {
        Body.setPosition(walls[1], {
          x: container.clientWidth / 2,
          y: container.clientHeight + 50,
        });
      }

      if (walls[3]) {
        Body.setPosition(walls[3], {
          x: container.clientWidth + 50,
          y: container.clientHeight / 2,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      Events.off(engine, "afterUpdate", constrainBodies);

      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
      }

      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }

      if (engineRef.current) {
        Engine.clear(engineRef.current);
        World.clear(engineRef.current.world, false);
      }
    };
  }, []);

  // Effect to start physics when visibility changes
  useEffect(() => {
    if (isVisible && initialized && engineRef.current && runnerRef.current) {
      // Set consistent gravity
      engineRef.current.gravity.y = 0.6;

      // Apply varied forces to create a chaotic falling pattern
      pillsRef.current.forEach((pill) => {
        // Random horizontal forces, stronger than before
        const randomXForce = (Math.random() - 0.5) * 0.05;
        // Random vertical forces, some negative (upward) for bouncy effect
        const randomYForce = Math.random() * 0.02 - 0.005;

        // Randomize physics properties for each pill
        pill.restitution = 0.3 + Math.random() * 0.5; // Variable bounciness
        pill.frictionAir = 0.01 + Math.random() * 0.04; // Variable air resistance

        // Apply random impulses for chaotic movement
        Body.applyForce(pill, pill.position, {
          x: randomXForce,
          y: randomYForce,
        });

        // Add spin to some pills
        const randomSpin = (Math.random() - 0.5) * 0.1;
        Body.setAngularVelocity(pill, randomSpin);
      });

      // Start the physics engine
      Runner.run(runnerRef.current, engineRef.current);
    }
  }, [isVisible, initialized]);

  return (
    <div
      className={`${styles.container} ${className} ${
        isVisible ? styles.visible : styles.hidden
      }`}
      ref={sceneRef}
    >
      {/* Matter.js will render here */}
    </div>
  );
}
