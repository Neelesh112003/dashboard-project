import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/login")}
      style={{
        backgroundColor: "#44a83e",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 32px",
        fontSize: "15px",
        fontWeight: 500,
        cursor: "pointer",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#379932"}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#44a83e"}
    >
      Log in
    </button>
  );
};

export default LoginButton;