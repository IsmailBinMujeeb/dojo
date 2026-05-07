import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BookOpen,
    DraftingCompass,
    Menu,
    Radio,
    Search,
    User,
    UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Explore = () => {
    const navigate = useNavigate();
    const [searchQueryState, setSearchQueryState] = useState("");

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter" && searchQueryState.trim()) {
            navigate(`/explore/${searchQueryState}`);
        }
    };

    const handleChange = (e) => {
        setSearchQueryState(e.target.value);
    };

    return (
        <>
            <header className="z-40 bg-white flex justify-between items-center px-8 h-16">
                <div className="flex items-center flex-1">
                    <div className="relative w-full group gap-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Search />
                        </span>
                        <input
                            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                            placeholder="Search the research labs..."
                            type="text"
                            value={searchQueryState}
                            onChange={handleChange}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>
                </div>
            </header>
            <div className="pt-8 px-8 pb-16 space-y-12">
                <section className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end p-12 bg-neutral-900">
                    <img
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        data-alt="modern minimalist research laboratory with soft neon yellow lighting accents and scientific glassware in a high-tech clean environment"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TJDP7r3Xkzi_CcoVSosizaIcsnfn5DQ48lUMXGNoCNecVHKQuMdDTzIouN1Kh-xj1axAfhZXquYWwJ1koPYoHtUA14OiMcnhU1vWCAOlknWczHPC2y07C3YyZBR_nj2ksMP8-6x5NRrjbyhH06ohH3j1QXD_Ggr51X0qEFs6BmBSckz8ofofTlD2Mn2kXAwR5R5U4pW9wQ5Zhypt-aHOdEAPX1DW6yFZDs7gvIiSA7VqUf4i8LK_Q6B6UFlbJQ257-JDEQ4QngdV"
                    />
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary text-secondary text-xs font-bold tracking-widest uppercase mb-4">
                            Live Stream
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
                            Pulse of the Laboratory
                        </h2>
                        <p className="text-lg text-neutral-200 leading-relaxed font-medium">
                            Join 4,200 scholars currently debating the ethical
                            implications of autonomous academic peer-review
                            systems.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button className="bg-primary cursor-pointer text-secondary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined">
                                    <Radio />
                                </span>
                                Enter Lab
                            </button>
                            <button className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold border border-white/20 hover:bg-white/20 transition-colors">
                                Explore Archives
                            </button>
                        </div>
                    </div>
                </section>
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* <!-- Trending Citations (Left Column - 8 cols) -->*/}
                    <div className="col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <span className="w-8 h-1 bg-primary"></span>
                                Trending Citations
                            </h3>
                            <a
                                className="text-sm font-bold text-tertiary hover:underline"
                                href="#"
                            >
                                View Global Index
                            </a>
                        </div>
                        <div className="space-y-4">
                            {/* <!-- Citation Card 1 -->*/}
                            <div className="bg-white p-6 rounded-2xl flex gap-6 transition-colors">
                                <div className="shrink-0 w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined text-3xl">
                                        <BookOpen />
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                                            Neuroscience
                                        </span>
                                        <span className="text-xs text-neutral-400">
                                            2.4k Mentions
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">
                                        "Synaptic Plasticity in the Digital Age:
                                        A Comparative Analysis"
                                    </h4>
                                    <p className="text-on-surface-variant text-sm line-clamp-2">
                                        Exploring how constant digital
                                        interaction alters the long-term
                                        potentiation in undergraduate neural
                                        pathways...
                                    </p>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-200"></div>
                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-300"></div>
                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-400"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-neutral-500">
                                            Discussed by Prof. Aris &amp; 14
                                            others
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Citation Card 2 -->*/}
                            <div className="bg-white p-6 rounded-2xl flex gap-6">
                                <div className="shrink-0 w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined text-3xl">
                                        <DraftingCompass />
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                                            Urban Design
                                        </span>
                                        <span className="text-xs text-neutral-400">
                                            1.8k Mentions
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">
                                        "Kinetic Architecture: The Living
                                        Library Framework"
                                    </h4>
                                    <p className="text-on-surface-variant text-sm line-clamp-2">
                                        How moving structural elements within
                                        campus libraries facilitate
                                        collaborative cognitive flow...
                                    </p>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-200"></div>
                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-300"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-neutral-500">
                                            Discussed by Dr. Thorne &amp; 8
                                            others
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Recommended Mentors (Right Column - 4 cols) -->*/}
                    <div className="col-span-4 bg-white rounded-3xl p-8 sticky top-24">
                        <h3 className="text-xl font-black tracking-tight mb-8">
                            Scholarly Mentors
                        </h3>
                        <div className="space-y-6">
                            {/* <!-- Mentor 1 -->*/}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        alt=""
                                        className="w-14 h-14 rounded-full object-cover"
                                        data-alt="professional headshot of a mature academic man with glasses and a thoughtful expression"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFc1P62fid8BQuaKqKgc62W5Aen2VfQOcoqg5u8sBhriIyUZJiLfT_MLT-JbbARfK5o-8eibQ7BXrz6xdy3C2fE8n0FHY0zVqHsl8QlnsqR4VkIt0-Bi8jJC9Z9azeUGXI7IA8u6sCF8FE-hDgubak2_5IeMrX7lpzaS_Sbb2OSoKBIvyhzy4emXyMI4Hi1Tnu5f3ViAPxU1218zZ9SteOIAQsXmf9-l-WM66aNaH94fQs1eFxlmGiJix3WWx0a0L_goqrtql6mypC"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-surface-container-low rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-sm">
                                        Dr. Julian Vane
                                    </h5>
                                    <p className="text-xs text-on-surface-variant">
                                        Quantum Linguistics
                                    </p>
                                </div>
                                <button className="text-secondary hover:secondary p-2 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">
                                        <UserPlus />
                                    </span>
                                </button>
                            </div>
                            {/* <!-- Mentor 2 -->*/}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        alt=""
                                        className="w-14 h-14 rounded-full object-cover"
                                        data-alt="portrait of a young female researcher with a bright smile in a professional setting"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3qkkKU6xg744kAdijyyUXtBZNQdItcAnriIu7QbuRDASX2b4f1q9Uu-BlGW9gSBmSyJR28PdG4wB4MgB6B63M7Ubppg3EfsK6lpzpFukqM_aU62oUVQqaAdEYmmY3UofC9mzZl63iHO2V_nKJta8Z9oLZzoYGBEIPVWcU0R7zuMk2lI6wpcWTAnCR7LTd1DKNtlSrXIHLn8K3cAyMDHqHkHIxlBd4RZ7APeaQVt03yCFxNie8uzL5PpAWjhdkyHWu06GwQhscf-ww"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-surface-container-low rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-sm">
                                        Prof. Elena Sato
                                    </h5>
                                    <p className="text-xs text-on-surface-variant">
                                        Bio-Ethical Systems
                                    </p>
                                </div>
                                <button className="text-secondary hover:secondary p-2 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">
                                        <UserPlus />
                                    </span>
                                </button>
                            </div>
                            {/* <!-- Mentor 3 -->*/}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        alt=""
                                        className="w-14 h-14 rounded-full object-cover"
                                        data-alt="middle aged professor with a beard looking towards the camera in a library setting"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoY38_NwFZK23DurKuAH6YTaqHnFVhYQCeB5NcRhpqMzn8ml5aRkXg--AG_xhz8uXpnzvF9zI4AaW0I_g_QxPh_s6EECdrsi2-5O8I-yBgHtQ7KY1Wj921iR8i9yocm4byg6fQ6j1Z9WXt7fY5YW8vhCVQqEZgfpcyyIKqka9WEhRfkcAwJu2VLO1TKRBfd1T5h7pS_6u5xGYWr2mEPSLfWUtpMXUARkBFOCzAohvUlFcaAOexMYk6Jt3kPnri0mmMT7mT8KRlwVoU"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-sm">
                                        Dr. Marcus Chen
                                    </h5>
                                    <p className="text-xs text-on-surface-variant">
                                        Computational History
                                    </p>
                                </div>
                                <button className="text-secondary hover:secondary p-2 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">
                                        <UserPlus />
                                    </span>
                                </button>
                            </div>
                        </div>
                        <Button className="w-full bg-secondary text-accent mt-8 hover:bg-secondary/90">
                            View Mentor Directory
                        </Button>
                    </div>
                </div>
                {/* <!-- Kinetic Feed Section (Visual Interest) --> */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary"></span>
                            Active Research Nodes
                        </h3>
                    </div>
                    <div className="kinetic-grid">
                        {/* <!-- Node 1 -->*/}
                        <div className="col-span-4 kinetic-card bg-white rounded-3xl overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    data-alt="abstract digital visualization of data nodes and neural connections in blue and purple tones"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKZNT1zuhC9IU8sLsxI-y2TPbALbQuXeey0Cj11-UaVY1btHBn5tf_jR1pgAgyn1t58YGEVCkEon-DdMWjr7ScCyDQCOyatOZUKFDycMHAP_EnI3cFuSmbbPI_VNuJCFjDLY04_ozsv4EAxmX_DX1G84P8SlHj3119z4etHTGGBWXGpdCsl8kSd6EpjKZf_8H-H8dwfMAFP0gFPogcxDMNkv3cr5hMYd6kjZQEgAnL-FuxSprlvppwN4ZfOp8XLOL_uN8x5wJRakqP"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                                    AI &amp; Ethics
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-black text-lg mb-2">
                                    The Algorithmic Conscience
                                </h4>
                                <p className="text-sm text-on-surface-variant mb-4">
                                    A cross-disciplinary study on embedding
                                    humanistic values into LLM kernels.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-neutral-400">
                                        12 Labs Participating
                                    </span>
                                    <span className="material-symbols-outlined text-secondary group-hover:translate-x-2 transition-transform">
                                        <ArrowRight />
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* <!-- Node 2 -->*/}
                        <div className="col-span-4 kinetic-card bg-white rounded-3xl overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    data-alt="close up of plant cells under a microscope showing vibrant green cellular structures"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJV2fSJ0nn2FMF12vjc_95QWc53VPiPPN8_C6sEodLy_qSU9F0dotFl0keYOrmFvRVaO5wfLS4BNQdbBBfE8GqJcYRIgSvJVoOlQv074Q2BdP3PvcwT8f4E86uCSLt6Sia9Fk0yLCSzNlyyF-CEsJrpxiDFL1HZLYlLFiRrg3oESbl9q250XjeEOnrhV9QKwQSEfWqOCwT93kEEDefMVYO1eFs-dKd9Y9vZKDq_eebcdHYXXhIZaV6WK8RgUcyEQnmJB2T8joAjyrY"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-tertiary">
                                    Synthetic Biology
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-black text-lg mb-2">
                                    Living Infrastructure
                                </h4>
                                <p className="text-sm text-on-surface-variant mb-4">
                                    Developing architectural materials that
                                    photosynthesize and repair themselves.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-neutral-400">
                                        8 Labs Participating
                                    </span>
                                    <span className="material-symbols-outlined text-secondary group-hover:translate-x-2 transition-transform">
                                        <ArrowRight />
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Node 3*/}
                        <div className="col-span-4 kinetic-card bg-white rounded-3xl overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    data-alt="complex geometric fractals rendered in glowing golden light against a dark background"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLrZ-4yaBdNi9g4D0UJytvyLpkeOMzQxcN6PHOh3tm6WCtE3m3VcCw7ul6Sz9ROucDP9zgoTB-lX8b0wYFoojgzkW5r0n99sOPkKMjpVX4aNuKs8-828-GWp_4e1ujX0DFjkWDWGqFWQmF3CjHcPiRjZOinSkNe47RHPqb3TioSlowByC3s6joWxH4g0FfxkNyf4dPq0oy03c1uxsjTNPbHE-z_4v_vdof4GVtMct25ftwfdC5HByzR8EF0nDPIUzVW_n6Tn49cvf_"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-error">
                                    Pure Math
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-black text-lg mb-2">
                                    The Poincaré Persistence
                                </h4>
                                <p className="text-sm text-on-surface-variant mb-4">
                                    New breakthroughs in topological data
                                    analysis for non-linear social systems.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-neutral-400">
                                        15 Labs Participating
                                    </span>
                                    <span className="material-symbols-outlined text-secondary group-hover:translate-x-2 transition-transform">
                                        <ArrowRight />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Explore;
