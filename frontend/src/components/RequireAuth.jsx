import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRequireAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        }
    }, []);
};

export default useRequireAuth;