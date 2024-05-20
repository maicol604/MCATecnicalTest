import RangeOfValues from "@/components/rangeOfValues";
import { useEffect, useState } from "react";

const Exercise2 = () => {
    
    const [rangeOfValues, setRangeOfValues] = useState([]);

    useEffect(()=>{
        fetch("https://demo8449328.mockable.io/mca-tecnical-test")
        .then(response => response.json()) 
        .then(ranges => setRangeOfValues(ranges.rangeValues))
    },[])

    return (
        <div style={{padding: "4rem", width:"100%", display: "flex", justifyContent: "center", flexDirection:"column"}}>
            {rangeOfValues.length > 0 &&
                <RangeOfValues
                rangeOfValues={rangeOfValues}
                initialMin={10}
                initialMax={50}
                />
            }
        </div>
    )
}

export default Exercise2;