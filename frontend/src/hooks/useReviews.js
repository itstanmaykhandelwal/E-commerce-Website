import { useContext } from "react";

import { ReviewContext } from "../context/ReviewContext";

const useReviews = () => {
    return useContext(
        ReviewContext
    );
};

export default useReviews;