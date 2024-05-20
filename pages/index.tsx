import Range from "@/components/range";
import RangeOfValues from "@/components/rangeOfValues";
import { useEffect, useState } from "react";

export default function Home() {

  const [rangeOfValues, setRangeOfValues] = useState([]);

  useEffect(()=>{
    fetch("https://demo8449328.mockable.io/mca-tecnical-test")
    .then(response => response.json()) 
    .then(ranges => setRangeOfValues(ranges.rangeValues))
  },[])

  return (
    <>
      <main>
        <div style={{padding: "4rem", width:"100%", display: "flex", justifyContent: "center", flexDirection:"column"}}>
          <Range
            initialMin={8}
            initialMax={50}
            min={5.99}
            max={70.99}
          />
          {rangeOfValues.length > 0 &&
            <RangeOfValues
              rangeOfValues={rangeOfValues}
              initialMin={10}
              initialMax={50}
            />
          }
        </div>
      </main>
    </>
  );
}
