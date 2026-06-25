import { useState, useMemo, useEffect, useRef } from "react";
import { Eyebrow } from "./ui"; // Check UI import path: it should match parent components/os/apps/
import graphData from "./knowledge_graph.json";

interface Node {
  id: string;
  label: string;
  type: "agent" | "skill" | "core";
  description: string;
  group: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
}

export function GraphApp() {
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [gravity, setGravity] = useState(0.06);
  const [repulsion, setRepulsion] = useState(50);
  const [linkDistance, setLinkDistance] = useState(70);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);

  // Parse nodes and links
  const { nodes, links, nodeMap } = useMemo(() => {
    const rawNodes = (graphData as any).nodes || [];
    const rawLinks = (graphData as any).links || [];

    const nodesCopy: Node[] = rawNodes.map((n: any) => ({
      ...n,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      vx: 0,
      vy: 0,
    }));

    // Inject central core brain node representing Shared Memory Galaxy
    const coreNode: Node = {
      id: "shared-brain",
      label: "🧠 Collective Shared Brain",
      type: "core",
      description: "The primary workspace repository containing all agent memories, cross-project learned rules, and real-time environment status. All agents read from and feed back into this collective memory.",
      group: "core",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0
    };
    nodesCopy.push(coreNode);

    const map = new Map<string, Node>();
    nodesCopy.forEach((n) => map.set(n.id, n));

    const validLinks: Link[] = rawLinks.filter(
      (l: any) => map.has(l.source) && map.has(l.target)
    ).map(l => ({ source: l.source, target: l.target, type: l.type }));

    // Link every agent to the core brain to visually map the "shared brain"
    nodesCopy.forEach((n) => {
      if (n.type === "agent" && n.id !== "shared-brain") {
        validLinks.push({
          source: n.id,
          target: "shared-brain",
          type: "memory-access"
        });
      }
    });

    return { nodes: nodesCopy, links: validLinks, nodeMap: map };
  }, []);

  // Pan and zoom state
  const transformRef = useRef({ x: 0, y: 0, scale: 0.5 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const activeDragNodeRef = useRef<Node | null>(null);
  const hoveredNodeRef = useRef<Node | null>(null);

  // Compute stats
  const stats = useMemo(() => {
    const agents = nodes.filter((n) => n.type === "agent").length;
    const skills = nodes.filter((n) => n.type === "skill").length;
    return { agents, skills, totalNodes: nodes.length, totalLinks: links.length };
  }, [nodes, links]);

  // Handle Search Selection
  useEffect(() => {
    if (!search) return;
    const match = nodes.find((n) =>
      n.label.toLowerCase().includes(search.toLowerCase())
    );
    if (match) {
      setSelectedNode(match);
      // Center the camera on the matching node
      transformRef.current.x = -(match.x || 0) * transformRef.current.scale + (canvasRef.current?.width || 800) / 2;
      transformRef.current.y = -(match.y || 0) * transformRef.current.scale + (canvasRef.current?.height || 600) / 2;
    }
  }, [search, nodes]);

  // Main physics & rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const w = canvas.parentElement?.clientWidth || 800;
      const h = canvas.parentElement?.clientHeight || 600;
      canvas.width = w;
      canvas.height = h;

      // Generate starry background coordinates
      const stars: Star[] = [];
      for (let i = 0; i < 80; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.5 + 0.5,
          brightness: Math.random(),
        });
      }
      starsRef.current = stars;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial center camera
    transformRef.current.x = canvas.width / 2;
    transformRef.current.y = canvas.height / 2;

    const runSimulation = () => {
      if (physicsEnabled) {
        // 1. Repulsion force between all nodes (optimized subset repulsion)
        const nodeCount = nodes.length;
        const rep = repulsion * -10;

        for (let i = 0; i < nodeCount; i++) {
          const n1 = nodes[i];
          
          // Pull towards center gravity (or keep core node fixed in center)
          if (n1.id === "shared-brain") {
            n1.vx = 0;
            n1.vy = 0;
            n1.x = 0;
            n1.y = 0;
            continue;
          }

          n1.vx! -= (n1.x || 0) * gravity;
          n1.vy! -= (n1.y || 0) * gravity;

          // Repel from a subset of other nodes to prevent O(N^2) lag
          const step = Math.max(1, Math.floor(nodeCount / 120));
          for (let j = 0; j < nodeCount; j += step) {
            if (i === j) continue;
            const n2 = nodes[j];
            const dx = n2.x! - n1.x!;
            const dy = n2.y! - n1.y!;
            const distSq = dx * dx + dy * dy + 0.1;
            if (distSq < 150000) {
              const force = rep / distSq;
              n1.vx! += (dx / Math.sqrt(distSq)) * force;
              n1.vy! += (dy / Math.sqrt(distSq)) * force;
            }
          }
        }

        // 2. Link force (attraction)
        links.forEach((l) => {
          const n1 = nodeMap.get(l.source)!;
          const n2 = nodeMap.get(l.target)!;
          if (!n1 || !n2) return;

          const dx = n2.x! - n1.x!;
          const dy = n2.y! - n1.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const force = (dist - linkDistance) * 0.08;

          n1.vx! += (dx / dist) * force;
          n1.vy! += (dy / dist) * force;
          n2.vx! -= (dx / dist) * force;
          n2.vy! -= (dy / dist) * force;
        });

        // 3. Apply velocity & friction
        nodes.forEach((n) => {
          if (n === activeDragNodeRef.current || n.id === "shared-brain") return;
          n.x! += n.vx!;
          n.y! += n.vy!;
          n.vx! *= 0.65;
          n.vy! *= 0.65;
        });
      }

      // --- RENDERING ---
      // Cosmic Deep Blue/Space background
      ctx.fillStyle = "#090a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      ctx.save();
      starsRef.current.forEach((star) => {
        const pulse = Math.sin(Date.now() * 0.002 + star.x) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * pulse})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.restore();

      // Apply zoom & pan transformations
      const { x: tx, y: ty, scale: ts } = transformRef.current;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.scale(ts, ts);

      // Highlight connections of hovered/selected node
      const activeNode = hoveredNodeRef.current || selectedNode;
      const activeNeighborIds = new Set<string>();
      if (activeNode) {
        activeNeighborIds.add(activeNode.id);
        links.forEach((l) => {
          if (l.source === activeNode.id) activeNeighborIds.add(l.target);
          if (l.target === activeNode.id) activeNeighborIds.add(l.source);
        });
      }

      // Draw Links
      links.forEach((l) => {
        const n1 = nodeMap.get(l.source)!;
        const n2 = nodeMap.get(l.target)!;
        if (!n1 || !n2) return;

        const isHighlighted = activeNode && (l.source === activeNode.id || l.target === activeNode.id);
        
        if (l.type === "memory-access") {
          ctx.strokeStyle = isHighlighted ? "rgba(16, 185, 129, 0.7)" : "rgba(16, 185, 129, 0.12)";
          ctx.lineWidth = isHighlighted ? 2 : 0.8;
          // Dashed path to denote dynamic memory link
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(n1.x!, n1.y!);
          ctx.lineTo(n2.x!, n2.y!);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.strokeStyle = isHighlighted
            ? "rgba(168, 85, 247, 0.7)"
            : "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
          ctx.beginPath();
          ctx.moveTo(n1.x!, n1.y!);
          ctx.lineTo(n2.x!, n2.y!);
          ctx.stroke();
        }

        // Draw animated glowing photon traveling along highlighted link
        if (isHighlighted) {
          const time = Date.now() * 0.0025;
          const progress = (time % 1); // value between 0 and 1
          const px = n1.x! + (n2.x! - n1.x!) * progress;
          const py = n1.y! + (n2.y! - n1.y!) * progress;
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, 2 * Math.PI);
          ctx.fillStyle = l.type === "memory-access" ? "#34d399" : "#c084fc";
          ctx.shadowColor = l.type === "memory-access" ? "#34d399" : "#c084fc";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }
      });

      // Draw Nodes
      nodes.forEach((n) => {
        const isHighlighted = !activeNode || activeNeighborIds.has(n.id);
        const radius = n.type === "core" ? 14 : n.type === "agent" ? 7 : 4;
        
        // Outer glowing halo for the Core Brain
        if (n.type === "core") {
          ctx.save();
          const pulse = Math.sin(Date.now() * 0.003) * 4 + 18;
          const grad = ctx.createRadialGradient(n.x!, n.y!, 5, n.x!, n.y!, pulse);
          grad.addColorStop(0, "rgba(16, 185, 129, 0.4)");
          grad.addColorStop(1, "rgba(16, 185, 129, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.x!, n.y!, pulse, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(n.x!, n.y!, radius, 0, 2 * Math.PI);
        
        if (n.type === "core") {
          ctx.fillStyle = "#10b981";
        } else if (n.type === "agent") {
          ctx.fillStyle = isHighlighted ? "#a855f7" : "rgba(168, 85, 247, 0.15)";
        } else {
          ctx.fillStyle = isHighlighted ? "#38bdf8" : "rgba(56, 189, 248, 0.15)";
        }
        ctx.fill();

        // White border for selected or core node
        if (n === selectedNode || n.type === "core") {
          ctx.strokeStyle = n.type === "core" ? "#34d399" : "#ffffff";
          ctx.lineWidth = n.type === "core" ? 2 : 1.5;
          ctx.beginPath();
          ctx.arc(n.x!, n.y!, radius + 3, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Draw Labels
        if (showLabels && (ts > 0.4 || (activeNode && activeNeighborIds.has(n.id)) || n.type === "core")) {
          ctx.font = n.type === "core"
            ? "bold 13px Inter, sans-serif"
            : activeNode && n.id === activeNode.id
            ? "bold 11px Inter, sans-serif"
            : "9px Inter, sans-serif";
          ctx.fillStyle = isHighlighted ? "#f3f4f6" : "rgba(243, 244, 246, 0.2)";
          ctx.fillText(n.label, n.x! + radius + 6, n.y! + 3);
        }
      });

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(runSimulation);
    };

    runSimulation();

    // Mouse / Touch handlers for dragging and zoom
    const getCanvasMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const getNodeAtPos = (mousePos: { x: number; y: number }) => {
      const { x: tx, y: ty, scale: ts } = transformRef.current;
      const worldX = (mousePos.x - tx) / ts;
      const worldY = (mousePos.y - ty) / ts;

      for (const n of nodes) {
        const dx = n.x! - worldX;
        const dy = n.y! - worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = n.type === "core" ? 20 : 15;
        if (dist < radius) {
          return n;
        }
      }
      return null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getCanvasMousePos(e);
      const node = getNodeAtPos(pos);

      if (node) {
        if (node.id !== "shared-brain") {
          activeDragNodeRef.current = node;
        }
      } else {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX - transformRef.current.x, y: e.clientY - transformRef.current.y };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getCanvasMousePos(e);
      const node = getNodeAtPos(pos);
      hoveredNodeRef.current = node;

      if (activeDragNodeRef.current) {
        const { x: tx, y: ty, scale: ts } = transformRef.current;
        activeDragNodeRef.current.x = (pos.x - tx) / ts;
        activeDragNodeRef.current.y = (pos.y - ty) / ts;
        activeDragNodeRef.current.vx = 0;
        activeDragNodeRef.current.vy = 0;
      } else if (isDraggingRef.current) {
        transformRef.current.x = e.clientX - dragStartRef.current.x;
        transformRef.current.y = e.clientY - dragStartRef.current.y;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (activeDragNodeRef.current) {
        setSelectedNode(activeDragNodeRef.current);
      } else {
        const pos = getCanvasMousePos(e);
        const node = getNodeAtPos(pos);
        if (node) setSelectedNode(node);
      }
      activeDragNodeRef.current = null;
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const pos = getCanvasMousePos(e);
      const { x: tx, y: ty, scale: ts } = transformRef.current;

      const zoomFactor = 1.1;
      const newScale = e.deltaY < 0 ? ts * zoomFactor : ts / zoomFactor;
      const clampedScale = Math.max(0.08, Math.min(3, newScale));

      transformRef.current.x = pos.x - (pos.x - tx) * (clampedScale / ts);
      transformRef.current.y = pos.y - (pos.y - ty) * (clampedScale / ts);
      transformRef.current.scale = clampedScale;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [nodes, links, nodeMap, physicsEnabled, repulsion, gravity, linkDistance, showLabels, selectedNode]);

  // Node neighbors of selected
  const neighbors = useMemo(() => {
    if (!selectedNode) return [];
    const list: Node[] = [];
    links.forEach((l) => {
      if (l.source === selectedNode.id) {
        const targetNode = nodeMap.get(l.target);
        if (targetNode) list.push(targetNode);
      } else if (l.target === selectedNode.id) {
        const sourceNode = nodeMap.get(l.source);
        if (sourceNode) list.push(sourceNode);
      }
    });
    return list;
  }, [selectedNode, links, nodeMap]);

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#080a0f] text-gray-200">
      {/* Sidebar Controls and Details */}
      <aside className="md:w-80 shrink-0 border-r border-[#151722] bg-[#0c0d14] flex flex-col overflow-hidden">
        {/* Title */}
        <div className="p-4 border-b border-[#151722]">
          <Eyebrow color="#10b981">Shared Knowledge Network</Eyebrow>
          <h2 className="text-lg font-bold text-white mt-1">🧠 Memory Galaxy</h2>
          <div className="mt-2 text-xs text-gray-400 space-y-1">
            <div>Galaxy Core: <span className="text-emerald-400 font-semibold">1 Collective Mind</span></div>
            <div>Connected Nodes: <span className="text-purple-400 font-semibold">{stats.totalNodes}</span> (Agents: {stats.agents}, Skills: {stats.skills})</div>
            <div>Knowledge Lines: <span className="text-cyan-400 font-semibold">{stats.totalLinks}</span></div>
          </div>
        </div>

        {/* Action controls */}
        <div className="p-4 space-y-4 border-b border-[#151722] text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Search Knowledge</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skill or agent..."
              className="w-full rounded-md border border-[#23263b] bg-[#080a0f] px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Gravitational Lock</span>
            <button
              onClick={() => setPhysicsEnabled(!physicsEnabled)}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                physicsEnabled ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              {physicsEnabled ? "Engaged" : "Paused"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Show Node Labels</span>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                showLabels ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              {showLabels ? "Visible" : "Hidden"}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400">Solar Repulsion</span>
              <span>{repulsion}</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={repulsion}
              onChange={(e) => setRepulsion(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400">Orbital Distance</span>
              <span>{linkDistance}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              value={linkDistance}
              onChange={(e) => setLinkDistance(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* Selected Node Details */}
        <div className="flex-1 overflow-auto p-4 space-y-4 text-xs">
          {selectedNode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    selectedNode.type === "core"
                      ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                      : selectedNode.type === "agent"
                      ? "bg-purple-500"
                      : "bg-cyan-500"
                  }`}
                />
                <span className="font-bold text-white text-[13px]">{selectedNode.label}</span>
              </div>

              <div className="rounded-md bg-[#080a0f] p-2.5 border border-[#151722] text-[11px] leading-relaxed text-gray-300">
                <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">
                  Type: {selectedNode.type}
                </div>
                {selectedNode.description}
              </div>

              {neighbors.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1.5">
                    Orbits & Channels ({neighbors.length})
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {neighbors.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setSelectedNode(n)}
                        className="w-full text-left flex items-center gap-2 rounded bg-[#13141f] hover:bg-[#1a1b2a] px-2 py-1 transition text-[11px]"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            n.type === "core" ? "bg-emerald-500" : n.type === "agent" ? "bg-purple-500" : "bg-cyan-500"
                          }`}
                        />
                        <span className="truncate text-gray-300">{n.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-8">
              <span className="text-3xl mb-2">☄️</span>
              <p>Click a star/node in the galaxy to trace data channels and shared memory mapping.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-hidden h-[400px] md:h-full">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        {/* Floating instruction tooltip */}
        <div className="absolute bottom-4 left-4 bg-[#0c0d14]/95 backdrop-blur-sm border border-[#151722] px-3 py-2 rounded-lg text-[10px] text-gray-400 pointer-events-none space-y-0.5 shadow-xl">
          <div>🌌 <span className="text-white font-medium">Drag Space</span> to Navigate the Memory Galaxy</div>
          <div>🎛️ <span className="text-white font-medium">Scroll</span> to Zoom Space</div>
          <div>✨ <span className="text-white font-medium">Hold Star</span> to Pull / Orbit nodes</div>
        </div>
      </div>
    </div>
  );
}
