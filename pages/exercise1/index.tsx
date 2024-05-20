import Range from "@/components/range";

const Exercise1 = () => {
    return (
        <div style={{padding: "4rem", width:"100%", display: "flex", justifyContent: "center", flexDirection:"column"}}>
            <Range
                initialMin={8}
                initialMax={50}
                min={5.99}
                max={70.99}
            />
        </div>
    )
}

export default Exercise1;