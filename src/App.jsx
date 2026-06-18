import { useState, useEffect } from "react";

// TODO: Integrar con API real de app.drcarlosjaramillo.com para guardar perfil
// TODO: Embeber video de converteai/vturb en paso de bienvenida
// TODO: Integrar sistema de autenticación real (JWT/session)
// TODO: Conectar con lógica real del programa Desbloqueo Metabólico

const COLORS = {
  bg: "#0a0f1a",
  bgCard: "#111827",
  bgCardAlt: "#1a2236",
  accent: "#c8a96e",
  accentDark: "#a8893e",
  accentLight: "#e0c98a",
  text: "#f5f0e8",
  textMuted: "#9ca3af",
  textDark: "#6b7280",
  border: "#1e2d45",
  borderHover: "#c8a96e",
  success: "#10b981",
  error: "#ef4444",
  white: "#ffffff",
};

const STEPS = [
  { id: 1, label: "Bienvenida" },
  { id: 2, label: "Perfil" },
  { id: 3, label: "Salud" },
  { id: 4, label: "Objetivos" },
  { id: 5, label: "Confirmación" },
];

const OBJETIVOS = [
  { id: "peso", icon: "⚖️", label: "Perder peso" },
  { id: "energia", icon: "⚡", label: "Más energía" },
  { id: "sueno", icon: "😴", label: "Mejorar el sueño" },
  { id: "digestion", icon: "🌿", label: "Mejor digestión" },
  { id: "hormonal", icon: "🔬", label: "Balance hormonal" },
  { id: "rendimiento", icon: "🏃", label: "Rendimiento físico" },
  { id: "mental", icon: "🧠", label: "Claridad mental" },
  { id: "inflamacion", icon: "🛡️", label: "Reducir inflamación" },
];

const CONDICIONES = [
  "Diabetes tipo 2",
  "Resistencia a la insulina",
  "Hipotiroidismo",
  "Hipertiroidismo",
  "Síndrome metabólico",
  "Colesterol alto",
  "Hipertensión",
  "Hígado graso",
  "Intestino permeable",
  "Ninguna de las anteriores",
];

const ACTIVIDAD = [
  { id: "sedentario", label: "Sedentario", desc: "Poco o ningún ejercicio" },
  { id: "ligero", label: "Ligero", desc: "1-3 días/semana" },
  { id: "moderado", label: "Moderado", desc: "3-5 días/semana" },
  { id: "activo", label: "Activo", desc: "6-7 días/semana" },
  { id: "muy_activo", label: "Muy activo", desc: "Ejercicio intenso diario" },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [animDir, setAnimDir] = useState("forward");
  const [visible, setVisible] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const [form, setForm] = useState({
    // Perfil
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    genero: "",
    edad: "",
    pais: "",
    // Salud
    peso: "",
    altura: "",
    condiciones: [],
    actividad: "",
    // Objetivos
    objetivos: [],
    motivacion: "",
    compromiso: "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleCondicion = (cond) => {
    setForm((prev) => {
      const list = prev.condiciones.includes(cond)
        ? prev.condiciones.filter((c) => c !== cond)
        : [...prev.condiciones, cond];
      return { ...prev, condiciones: list };
    });
  };

  const toggleObjetivo = (id) => {
    setForm((prev) => {
      const list = prev.objetivos.includes(id)
        ? prev.objetivos.filter((o) => o !== id)
        : [...prev.objetivos, id];
      return { ...prev, objetivos: list };
    });
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 2) {
      if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido";
      if (!form.apellido.trim()) newErrors.apellido = "El apellido es requerido";
      if (!form.email.trim()) newErrors.email = "El email es requerido";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Email inválido";
      if (!form.genero) newErrors.genero = "Selecciona tu género";
      if (!form.edad.trim()) newErrors.edad = "La edad es requerida";
      else if (isNaN(form.edad) || +form.edad < 18 || +form.edad > 99)
        newErrors.edad = "Edad inválida (18-99)";
    }
    if (s === 3) {
      if (!form.peso.trim()) newErrors.peso = "El peso es requerido";
      if (!form.altura.trim()) newErrors.altura = "La altura es requerida";
      if (!form.actividad) newErrors.actividad = "Selecciona tu nivel de actividad";
    }
    if (s === 4) {
      if (form.objetivos.length === 0)
        newErrors.objetivos = "Selecciona al menos un objetivo";
      if (!form.compromiso) newErrors.compromiso = "Selecciona tu nivel de compromiso";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = (next) => {
    if (next > step && !validateStep(step)) return;
    const dir = next > step ? "forward" : "backward";
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setVisible(true);
    }, 300);
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;
    // TODO: Enviar datos al backend real de app.drcarlosjaramillo.com
    setSubmitted(true);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const styles = {
    root: {
      minHeight: "100vh",
      background: COLORS.bg,
      fontFamily: "'Jost', sans-serif",
      color: COLORS.text,
      overflowX: "hidden",
    },
    header: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(10,15,26,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "16px 24px",
    },
    headerInner: {
      maxWidth: 640,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    logoText: {
      fontSize: 18,
      fontWeight: 700,
      color: COLORS.accent,
      letterSpacing: "0.5px",
    },
    logoSub: {
      fontSize: 11,
      color: COLORS.textMuted,
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    progressBar: {
      width: "100%",
      height: 4,
      background: COLORS.border,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      width: `${progress}%`,
      background: `linear-gradient(90deg, ${COLORS.accentDark}, ${COLORS.accent})`,
      borderRadius: 2,
      transition: "width 0.4s ease",
    },
    stepsRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    stepDot: (active, done) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      cursor: done ? "pointer" : "default",
    }),
    dot: (active, done) => ({
      width: 28,
      height: 28,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      background: done
        ? COLORS.success
        : active
        ? COLORS.accent
        : COLORS.border,
      color: done || active ? COLORS.bg : COLORS.textMuted,
      transition: "all 0.3s ease",
      border: active ? `2px solid ${COLORS.accentLight}` : "2px solid transparent",
    }),
    dotLabel: (active) => ({
      fontSize: 9,
      color: active ? COLORS.accent : COLORS.textMuted,
      fontWeight: active ? 600 : 400,
      letterSpacing: "0.5px",
      display: "none",
    }),
    main: {
      maxWidth: 640,
      margin: "0 auto",
      padding: "32px 20px 80px",
    },
    card: {
      background: COLORS.bgCard,
      borderRadius: 20,
      border: `1px solid ${COLORS.border}`,
      overflow: "hidden",
      opacity: visible ? 1 : 0,
      transform: visible
        ? "translateX(0)"
        : animDir === "forward"
        ? "translateX(40px)"
        : "translateX(-40px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
    cardHeader: {
      padding: "32px 32px 24px",
      borderBottom: `1px solid ${COLORS.border}`,
      background: `linear-gradient(135deg, ${COLORS.bgCardAlt} 0%, ${COLORS.bgCard} 100%)`,
    },
    stepBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: `${COLORS.accent}20`,
      border: `1px solid ${COLORS.accent}40`,
      borderRadius: 20,
      padding: "4px 12px",
      fontSize: 11,
      color: COLORS.accent,
      fontWeight: 600,
      letterSpacing: "1px",
      textTransform: "uppercase",
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 26,
      fontWeight: 700,
      color: COLORS.text,
      marginBottom: 8,
      lineHeight: 1.3,
    },
    cardDesc: {
      fontSize: 14,
      color: COLORS.textMuted,
      lineHeight: 1.6,
    },
    cardBody: {
      padding: "28px 32px",
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      color: COLORS.textMuted,
      marginBottom: 8,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    },
    input: (hasError) => ({
      width: "100%",
      padding: "12px 16px",
      background: COLORS.bgCardAlt,
      border: `1px solid ${hasError ? COLORS.error : COLORS.border}`,
      borderRadius: 10,
      color: COLORS.text,
      fontSize: 15,
      fontFamily: "'Jost', sans-serif",
      outline: "none",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
    }),
    errorText: {
      fontSize: 12,
      color: COLORS.error,
      marginTop: 6,
    },
    row2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
    },
    select: (hasError) => ({
      width: "100%",
      padding: "12px 16px",
      background: COLORS.bgCardAlt,
      border: `1px solid ${hasError ? COLORS.error : COLORS.border}`,
      borderRadius: 10,
      color: COLORS.text,
      fontSize: 15,
      fontFamily: "'Jost', sans-serif",
      outline: "none",
      appearance: "none",
      cursor: "pointer",
      boxSizing: "border-box",
    }),
    gridCheck: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
    },
    checkItem: (selected) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      background: selected ? `${COLORS.accent}15` : COLORS.bgCardAlt,
      border: `1px solid ${selected ? COLORS.accent : COLORS.border}`,
      borderRadius: 10,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: 13,
      color: selected ? COLORS.text : COLORS.textMuted,
      fontWeight: selected ? 600 : 400,
    }),
    checkbox: (selected) => ({
      width: 18,
      height: 18,
      borderRadius: 4,
      border: `2px solid ${selected ? COLORS.accent : COLORS.border}`,
      background: selected ? COLORS.accent : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s ease",
    }),
    radioGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    radioItem: (selected) => ({
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 18px",
      background: selected ? `${COLORS.accent}15` : COLORS.bgCardAlt,
      border: `1px solid ${selected ? COLORS.accent : COLORS.border}`,
      borderRadius: 12,
      cursor: "pointer",
      transition: "all 0.2s ease",
    }),
    radioDot: (selected) => ({
      width: 20,
      height: 20,
      borderRadius: "50%",
      border: `2px solid ${selected ? COLORS.accent : COLORS.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s ease",
    }),
    radioDotInner: (selected) => ({
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: selected ? COLORS.accent : "transparent",
      transition: "all 0.2s ease",
    }),
    radioLabel: {
      fontSize: 14,
      fontWeight: 600,
      color: COLORS.text,
    },
    radioDesc: {
      fontSize: 12,
      color: COLORS.textMuted,
    },
    objetivosGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
    },
    objItem: (selected) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: "16px 10px",
      background: selected ? `${COLORS.accent}15` : COLORS.bgCardAlt,
      border: `2px solid ${selected ? COLORS.accent : COLORS.border}`,
      borderRadius: 14,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
    }),
    objIcon: {
      fontSize: 28,
    },
    objLabel: (selected) => ({
      fontSize: 12,
      fontWeight: 600,
      color: selected ? COLORS.accent : COLORS.textMuted,
      lineHeight: 1.3,
    }),
    textarea: {
      width: "100%",
      padding: "12px 16px",
      background: COLORS.bgCardAlt,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      color: COLORS.text,
      fontSize: 14,
      fontFamily: "'Jost', sans-serif",
      outline: "none",
      resize: "vertical",
      minHeight: 90,
      boxSizing: "border-box",
    },
    footer: {
      padding: "20px 32px 28px",
      borderTop: `1px solid ${COLORS.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    btnSecondary: (hovered) => ({
      padding: "12px 24px",
      background: hovered ? COLORS.bgCardAlt : "transparent",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      color: COLORS.textMuted,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "'Jost', sans-serif",
      transition: "all 0.2s ease",
    }),
    btnPrimary: (hovered) => ({
      flex: 1,
      padding: "14px 28px",
      background: hovered
        ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`
        : `linear-gradient(135deg, ${COLORS.accentDark}, ${COLORS.accent})`,
      border: "none",
      borderRadius: 10,
      color: COLORS.bg,
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Jost', sans-serif",
      transition: "all 0.2s ease",
      transform: hovered ? "translateY(-1px)" : "translateY(0)",
      boxShadow: hovered ? `0 8px 24px ${COLORS.accent}40` : "none",
      letterSpacing: "0.5px",
    }),
    summarySection: {
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: COLORS.accent,
      letterSpacing: "1px",
      textTransform: "uppercase",
      marginBottom: 10,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "8px 0",
      borderBottom: `1px solid ${COLORS.border}`,
      gap: 12,
    },
    summaryKey: {
      fontSize: 13,
      color: COLORS.textMuted,
      fontWeight: 500,
    },
    summaryVal: {
      fontSize: 13,
      color: COLORS.text,
      fontWeight: 600,
      textAlign: "right",
      flex: 1,
    },
    tag: {
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      background: `${COLORS.accent}20`,
      border: `1px solid ${COLORS.accent}30`,
      borderRadius: 20,
      fontSize: 11,
      color: COLORS.accent,
      fontWeight: 600,
      margin: "2px",
    },
    successScreen: {
      minHeight: "100vh",
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      textAlign: "center",
    },
    successIcon: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      background: `${COLORS.success}20`,
      border: `3px solid ${COLORS.success}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
      marginBottom: 24,
      margin: "0 auto 24px",
    },
    successTitle: {
      fontSize: 30,
      fontWeight: 700,
      color: COLORS.text,
      marginBottom: 12,
    },
    successDesc: {
      fontSize: 15,
      color: COLORS.textMuted,
      lineHeight: 1.7,
      maxWidth: 420,
      margin: "0 auto 32px",
    },
    videoPlaceholder: {
      width: "100%",
      aspectRatio: "16/9",
      background: COLORS.bgCardAlt,
      borderRadius: 14,
      border: `1px solid ${COLORS.border}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      marginBottom: 24,
      cursor: "pointer",
    },
    playBtn: {
      width: 60,
      height: 60,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${COLORS.accentDark}, ${COLORS.accent})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
    },
    divider: {
      height: 1,
      background: COLORS.border,
      margin: "20px 0",
    },
    infoBox: {
      background: `${COLORS.accent}10`,
      border: `1px solid ${COLORS.accent}30`,
      borderRadius: 12,
      padding: "16px 18px",
      marginBottom: 20,
    },
    infoBoxText: {
      fontSize: 13,
      color: COLORS.textMuted,
      lineHeight: 1.6,
    },
  };

  if (submitted) {
    return (
      <div style={styles.root}>
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div style={styles.successScreen}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successTitle}>¡Perfil completado!</h1>
          <p style={styles.successDesc}>
            Bienvenido/a al programa{" "}
            <strong style={{ color: COLORS.accent }}>Desbloqueo Metabólico</strong>.
            Tu perfil ha sido guardado. Pronto recibirás acceso a tu plan
            personalizado en el correo <strong>{form.email}</strong>.
          </p>
          {/* TODO: Redirigir al dashboard real tras el onboarding */}
          <button
            style={styles.btnPrimary(hoveredBtn === "dashboard")}
            onMouseEnter={() => setHoveredBtn("dashboard")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => {
              // TODO: Redirigir a app.drcarlosjaramillo.com/dashboard
              alert("Redirigiendo al dashboard... (TODO: implementar redirección real)");
            }}
          >
            Ir al programa →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoRow}>
            <div>
              <div style={styles.logoText}>Desbloqueo Metabólico</div>
              <div style={styles.logoSub}>Dr. Carlos Jaramillo</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />
          </div>

          {/* Step Dots */}
          <div style={styles.stepsRow}>
            {STEPS.map((s) => {
              const active = s.id === step;
              const done = s.id < step;
              return (
                <div
                  key={s.id}
                  style={styles.stepDot(active, done)}
                  onClick={() => done && goToStep(s.id)}
                  title={s.label}
                >
                  <div style={styles.dot(active, done)}>
                    {done ? "✓" : s.id}
                  </div>
                  <span style={{ ...styles.dotLabel(active), display: "block" }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={styles.main}>
        <div style={styles.card}>

          {/* STEP 1: Bienvenida */}
          {step === 1 && (
            <>
              <div style={styles.cardHeader}>
                <div style={styles.stepBadge}>Paso 1 de 5</div>
                <h2 style={styles.cardTitle}>
                  Bienvenido/a al programa 👋
                </h2>
                <p style={styles.cardDesc}>
                  Estás a punto de iniciar tu transformación metabólica. Completa
                  este perfil en menos de 5 minutos para que el Dr. Carlos
                  Jaramillo pueda personalizar tu experiencia.
                </p>
              </div>
              <div style={styles.cardBody}>
                {/* TODO: Embeber video real de converteai/vturb aquí */}
                <div style={styles.videoPlaceholder}>
                  <div style={styles.playBtn}>▶</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                    Mensaje de bienvenida del Dr. Jaramillo
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textDark }}>
                    {/* TODO: Integrar player de converteai/vturb */}
                    Video de bienvenida personalizado
                  </div>
                </div>

                <div style={styles.infoBox}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: COLORS.accent,
                      marginBottom: 8,
                    }}
                  >
                    ¿Qué vas a encontrar en este programa?
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {[
                      "Plan nutricional personalizado según tu metabolismo",
                      "Protocolos para optimizar tus hormonas",
                      "Estrategias para reducir inflamación crónica",
                      "Seguimiento y ajustes continuos",
                    ].map((item, i) => (
                      <li key={i} style={styles.infoBoxText}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  {[
                    { icon: "🔒", label: "Datos seguros" },
                    { icon: "⏱️", label: "5 minutos" },
                    { icon: "🎯", label: "100% personalizado" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: COLORS.textMuted,
                      }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.footer}>
                <div />
                <button
                  style={styles.btnPrimary(hoveredBtn === "next1")}
                  onMouseEnter={() => setHoveredBtn("next1")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(2)}
                >
                  Comenzar mi perfil →
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Perfil Personal */}
          {step === 2 && (
            <>
              <div style={styles.cardHeader}>
                <div style={styles.stepBadge}>Paso 2 de 5</div>
                <h2 style={styles.cardTitle}>Tu perfil personal</h2>
                <p style={styles.cardDesc}>
                  Necesitamos conocerte mejor para personalizar tu plan.
                </p>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.row2}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nombre *</label>
                    <input
                      style={styles.input(!!errors.nombre)}
                      type="text"
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={(e) => updateField("nombre", e.target.value)}
                    />
                    {errors.nombre && (
                      <div style={styles.errorText}>{errors.nombre}</div>
                    )}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Apellido *</label>
                    <input
                      style={styles.input(!!errors.apellido)}
                      type="text"
                      placeholder="Tu apellido"
                      value={form.apellido}
                      onChange={(e) => updateField("apellido", e.target.value)}
                    />
                    {errors.apellido && (
                      <div style={styles.errorText}>{errors.apellido}</div>
                    )}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Correo electrónico *</label>
                  <input
                    style={styles.input(!!errors.email)}
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                  {errors.email && (
                    <div style={styles.errorText}>{errors.email}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Teléfono (opcional)</label>
                  <input
                    style={styles.input(false)}
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={form.telefono}
                    onChange={(e) => updateField("telefono", e.target.value)}
                  />
                </div>

                <div style={styles.row2}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Género *</label>
                    <select
                      style={styles.select(!!errors.genero)}
                      value={form.genero}
                      onChange={(e) => updateField("genero", e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="femenino">Femenino</option>
                      <option value="masculino">Masculino</option>
                      <option value="otro">Otro / Prefiero no decir</option>
                    </select>
                    {errors.genero && (
                      <div style={styles.errorText}>{errors.genero}</div>
                    )}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Edad *</label>
                    <input
                      style={styles.input(!!errors.edad)}
                      type="number"
                      placeholder="Ej: 35"
                      min={18}
                      max={99}
                      value={form.edad}
                      onChange={(e) => updateField("edad", e.target.value)}
                    />
                    {errors.edad && (
                      <div style={styles.errorText}>{errors.edad}</div>
                    )}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>País de residencia</label>
                  <select
                    style={styles.select(false)}
                    value={form.pais}
                    onChange={(e) => updateField("pais", e.target.value)}
                  >
                    <option value="">Seleccionar país...</option>
                    {[
                      "Colombia",
                      "México",
                      "Argentina",
                      "Chile",
                      "Perú",
                      "Ecuador",
                      "Venezuela",
                      "España",
                      "Estados Unidos",
                      "Otro",
                    ].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.footer}>
                <button
                  style={styles.btnSecondary(hoveredBtn === "back2")}
                  onMouseEnter={() => setHoveredBtn("back2")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(1)}
                >
                  ← Volver
                </button>
                <button
                  style={styles.btnPrimary(hoveredBtn === "next2")}
                  onMouseEnter={() => setHoveredBtn("next2")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(3)}
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Salud */}
          {step === 3 && (
            <>
              <div style={styles.cardHeader}>
                <div style={styles.stepBadge}>Paso 3 de 5</div>
                <h2 style={styles.cardTitle}>Tu estado de salud</h2>
                <p style={styles.cardDesc}>
                  Esta información es confidencial y nos permite adaptar el
                  programa a tus necesidades específicas.
                </p>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.row2}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Peso (kg) *</label>
                    <input
                      style={styles.input(!!errors.peso)}
                      type="number"
                      placeholder="Ej: 70"
                      value={form.peso}
                      onChange={(e) => updateField("peso", e.target.value)}
                    />
                    {errors.peso && (
                      <div style={styles.errorText}>{errors.peso}</div>
                    )}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Altura (cm) *</label>
                    <input
                      style={styles.input(!!errors.altura)}
                      type="number"
                      placeholder="Ej: 168"
                      value={form.altura}
                      onChange={(e) => updateField("altura", e.target.value)}
                    />
                    {errors.altura && (
                      <div style={styles.errorText}>{errors.altura}</div>
                    )}
                  </div>
                </div>

                {form.peso && form.altura && (
                  <div
                    style={{
                      ...styles.infoBox,
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                      Tu IMC estimado:{" "}
                      <strong style={{ color: COLORS.accent }}>
                        {(
                          +form.peso /
                          Math.pow(+form.altura / 100, 2)
                        ).toFixed(1)}
                      </strong>
                    </div>
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Condiciones de salud (selecciona las que apliquen)
                  </label>
                  <div style={styles.gridCheck}>
                    {CONDICIONES.map((cond) => {
                      const selected = form.condiciones.includes(cond);
                      return (
                        <div
                          key={cond}
                          style={styles.checkItem(selected)}
                          onClick={() => toggleCondicion(cond)}
                        >
                          <div style={styles.checkbox(selected)}>
                            {selected && (
                              <span
                                style={{
                                  color: COLORS.bg,
                                  fontSize: 11,
                                  fontWeight: 700,
                                }}
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          <span>{cond}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Nivel de actividad física *
                  </label>
                  {errors.actividad && (
                    <div style={{ ...styles.errorText, marginBottom: 8 }}>
                      {errors.actividad}
                    </div>
                  )}
                  <div style={styles.radioGroup}>
                    {ACTIVIDAD.map((act) => {
                      const selected = form.actividad === act.id;
                      return (
                        <div
                          key={act.id}
                          style={styles.radioItem(selected)}
                          onClick={() => {
                            updateField("actividad", act.id);
                          }}
                        >
                          <div style={styles.radioDot(selected)}>
                            <div style={styles.radioDotInner(selected)} />
                          </div>
                          <div>
                            <div style={styles.radioLabel}>{act.label}</div>
                            <div style={styles.radioDesc}>{act.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={styles.footer}>
                <button
                  style={styles.btnSecondary(hoveredBtn === "back3")}
                  onMouseEnter={() => setHoveredBtn("back3")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(2)}
                >
                  ← Volver
                </button>
                <button
                  style={styles.btnPrimary(hoveredBtn === "next3")}
                  onMouseEnter={() => setHoveredBtn("next3")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(4)}
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* STEP 4: Objetivos */}
          {step === 4 && (
            <>
              <div style={styles.cardHeader}>
                <div style={styles.stepBadge}>Paso 4 de 5</div>
                <h2 style={styles.cardTitle}>Tus objetivos</h2>
                <p style={styles.cardDesc}>
                  ¿Qué quieres lograr con el programa? Selecciona todos los que
                  apliquen.
                </p>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>¿Cuáles son tus objetivos? *</label>
                  {errors.objetivos && (
                    <div style={{ ...styles.errorText, marginBottom: 8 }}>
                      {errors.objetivos}
                    </div>
                  )}
                  <div style={styles.objetivosGrid}>
                    {OBJETIVOS.map((obj) => {
                      const selected = form.objetivos.includes(obj.id);
                      return (
                        <div
                          key={obj.id}
                          style={styles.objItem(selected)}
                          onClick={() => toggleObjetivo(obj.id)}
                        >
                          <div style={styles.objIcon}>{obj.icon}</div>
                          <div style={styles.objLabel(selected)}>
                            {obj.label}
                          </div>
                          {selected && (
                            <div
                              style={{
                                fontSize: 10,
                                color: COLORS.accent,
                                fontWeight: 700,
                              }}
                            >
                              ✓ Seleccionado
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={styles.divider} />

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    ¿Qué te motivó a unirte al programa? (opcional)
                  </label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Cuéntanos brevemente tu historia o motivación..."
                    value={form.motivacion}
                    onChange={(e) => updateField("motivacion", e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    ¿Cuál es tu nivel de compromiso? *
                  </label>
                  {errors.compromiso && (
                    <div style={{ ...styles.errorText, marginBottom: 8 }}>
                      {errors.compromiso}
                    </div>
                  )}
                  <div style={styles.radioGroup}>
                    {[
                      {
                        id: "explorar",
                        label: "Explorando opciones",
                        desc: "Quiero conocer más antes de comprometerme",
                      },
                      {
                        id: "moderado",
                        label: "Comprometido/a moderadamente",
                        desc: "Estoy listo/a para hacer cambios graduales",
                      },
                      {
                        id: "total",
                        label: "Totalmente comprometido/a",
                        desc: "Haré todo lo necesario para lograr mis objetivos",
                      },
                    ].map((opt) => {
                      const selected = form.compromiso === opt.id;
                      return (
                        <div
                          key={opt.id}
                          style={styles.radioItem(selected)}
                          onClick={() => updateField("compromiso", opt.id)}
                        >
                          <div style={styles.radioDot(selected)}>
                            <div style={styles.radioDotInner(selected)} />
                          </div>
                          <div>
                            <div style={styles.radioLabel}>{opt.label}</div>
                            <div style={styles.radioDesc}>{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={styles.footer}>
                <button
                  style={styles.btnSecondary(hoveredBtn === "back4")}
                  onMouseEnter={() => setHoveredBtn("back4")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(3)}
                >
                  ← Volver
                </button>
                <button
                  style={styles.btnPrimary(hoveredBtn === "next4")}
                  onMouseEnter={() => setHoveredBtn("next4")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(5)}
                >
                  Revisar perfil →
                </button>
              </div>
            </>
          )}

          {/* STEP 5: Confirmación */}
          {step === 5 && (
            <>
              <div style={styles.cardHeader}>
                <div style={styles.stepBadge}>Paso 5 de 5</div>
                <h2 style={styles.cardTitle}>Confirma tu perfil</h2>
                <p style={styles.cardDesc}>
                  Revisa que toda la información sea correcta antes de enviar.
                </p>
              </div>
              <div style={styles.cardBody}>
                {/* Resumen Perfil */}
                <div style={styles.summarySection}>
                  <div style={styles.summaryTitle}>📋 Datos personales</div>
                  {[
                    {
                      k: "Nombre completo",
                      v: `${form.nombre} ${form.apellido}`,
                    },
                    { k: "Email", v: form.email },
                    { k: "Teléfono", v: form.telefono || "No indicado" },
                    { k: "Género", v: form.genero || "No indicado" },
                    { k: "Edad", v: form.edad ? `${form.edad} años` : "No indicada" },
                    { k: "País", v: form.pais || "No indicado" },
                  ].map((item, i) => (
                    <div key={i} style={styles.summaryRow}>
                      <span style={styles.summaryKey}>{item.k}</span>
                      <span style={styles.summaryVal}>{item.v}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.summarySection}>
                  <div style={styles.summaryTitle}>🏥 Salud</div>
                  {[
                    {
                      k: "Peso",
                      v: form.peso ? `${form.peso} kg` : "No indicado",
                    },
                    {
                      k: "Altura",
                      v: form.altura ? `${form.altura} cm` : "No indicada",
                    },
                    {
                      k: "IMC",
                      v:
                        form.peso && form.altura
                          ? (
                              +form.peso / Math.pow(+form.altura / 100, 2)
                            ).toFixed(1)
                          : "N/A",
                    },
                    {
                      k: "Actividad",
                      v:
                        ACTIVIDAD.find((a) => a.id === form.actividad)
                          ?.label || "No indicada",
                    },
                  ].map((item, i) => (
                    <div key={i} style={styles.summaryRow}>
                      <span style={styles.summaryKey}>{item.k}</span>
                      <span style={styles.summaryVal}>{item.v}</span>
                    </div>
                  ))}
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryKey}>Condiciones</span>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      {form.condiciones.length > 0 ? (
                        form.condiciones.map((c) => (
                          <span key={c} style={styles.tag}>
                            {c}
                          </span>
                        ))
                      ) : (
                        <span style={styles.summaryVal}>Ninguna indicada</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={styles.summarySection}>
                  <div style={styles.summaryTitle}>🎯 Objetivos</div>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryKey}>Objetivos</span>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      {form.objetivos.length > 0 ? (
                        form.objetivos.map((id) => {
                          const obj = OBJETIVOS.find((o) => o.id === id);
                          return (
                            <span key={id} style={styles.tag}>
                              {obj?.icon} {obj?.label}
                            </span>
                          );
                        })
                      ) : (
                        <span style={styles.summaryVal}>Ninguno</span>
                      )}
                    </div>
                  </div>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryKey}>Compromiso</span>
                    <span style={styles.summaryVal}>
                      {form.compromiso === "explorar"
                        ? "Explorando opciones"
                        : form.compromiso === "moderado"
                        ? "Comprometido/a moderadamente"
                        : form.compromiso === "total"
                        ? "Totalmente comprometido/a"
                        : "No indicado"}
                    </span>
                  </div>
                </div>

                <div style={styles.infoBox}>
                  <div style={styles.infoBoxText}>
                    🔒{" "}
                    <strong style={{ color: COLORS.accent }}>
                      Privacidad garantizada:
                    </strong>{" "}
                    Tu información es confidencial y será usada únicamente para
                    personalizar tu experiencia en el programa Desbloqueo
                    Metabólico.
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{ marginTop: 2, accentColor: COLORS.accent }}
                      required
                    />
                    <span style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>
                      Acepto los{" "}
                      {/* TODO: Enlazar a términos reales del programa */}
                      <span style={{ color: COLORS.accent }}>
                        términos y condiciones
                      </span>{" "}
                      y la{" "}
                      <span style={{ color: COLORS.accent }}>
                        política de privacidad
                      </span>{" "}
                      del programa Desbloqueo Metabólico.
                    </span>
                  </label>
                </div>
              </div>
              <div style={styles.footer}>
                <button
                  style={styles.btnSecondary(hoveredBtn === "back5")}
                  onMouseEnter={() => setHoveredBtn("back5")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => goToStep(4)}
                >
                  ← Volver
                </button>
                <button
                  style={styles.btnPrimary(hoveredBtn === "submit")}
                  onMouseEnter={() => setHoveredBtn("submit")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={handleSubmit}
                >
                  ✓ Activar mi programa
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 12,
            color: COLORS.textDark,
          }}
        >
          © {new Date().getFullYear()} Dr. Carlos Jaramillo · Desbloqueo Metabólico
          <br />
          {/* TODO: Enlazar con soporte real */}
          ¿Necesitas ayuda?{" "}
          <span style={{ color: COLORS.accent, cursor: "pointer" }}>
            Contáctanos
          </span>
        </div>
      </main>
    </div>
  );
}