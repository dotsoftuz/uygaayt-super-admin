import { Route, Routes, Navigate } from "react-router-dom";
import Review from "./container/Review";
import ReviewDetails from "./details/ReviewDetails";

const index = () => {
    return (
        <Routes>
            <Route path=":id" element={<ReviewDetails />} />
            <Route path="*" element={<Review />} />
        </Routes>
    );
};

export default index;



