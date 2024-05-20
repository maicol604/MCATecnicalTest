import React, { useState, useRef, useEffect } from 'react';
import styles from "@/styles/range.module.css";

interface RangeProps {
  rangeOfValues?: number[],
  initialMin: number;
  initialMax: number;
}

const RangeOfValues: React.FC<RangeProps> = ({ rangeOfValues=[], initialMin, initialMax }) => {
    const [min, setMin] = useState<number>(rangeOfValues[0]);
    const [max, setMax] = useState<number>(rangeOfValues[(rangeOfValues?.length-1)]);
    const [minValue, setMinValue] = useState<number>(initialMin);
    const [maxValue, setMaxValue] = useState<number>(initialMax);
    const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
    const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);
    const [minValueStep, setPrevMinStepValue] = useState<number>(initialMin);
    const [maxValueStep, setPrevMaxStepValue] = useState<number>(initialMax);
    const rangeRef = useRef<HTMLDivElement>(null);
    const minBulletRef = useRef<HTMLDivElement>(null);
    const maxBulletRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(!(initialMin>min && initialMin<initialMax)){
            throw new Error("the value initialMin, must be greater than min and must be less than initialMax");
        }
        if(!(initialMax<max && initialMax>initialMin)){
            throw new Error("the value initialMax, must be greater than initialMin and must be less than max");
        }
        assertArrayAscending(rangeOfValues);
    },[])

    const getPercentage = (value: number): number => {
        return ((value - min) / (max - min)) * 100;
    };

    const assertArrayAscending = (arr:number[]) => {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i - 1] > arr[i]) {
                throw new Error(`Array is not in ascending order: element at index ${i - 1} (${arr[i - 1]}) is greater than element at index ${i} (${arr[i]})`);
            }
        }
    }


    const findValue = ( value:number ) => {
        let auxLeftValue = rangeOfValues.filter(item => (item<=value));
        let leftValue = auxLeftValue[auxLeftValue.length -1];
        let rightValue = rangeOfValues.filter(item => (item>=value))[0];
        // Math.abs()
        // console.log(leftValue,rightValue,Math.abs(leftValue-value), Math.abs(rightValue-value))
        return (Math.abs(rightValue-value)>Math.abs(leftValue-value))?leftValue:rightValue;
    }

    const handleMouseMove = (e: MouseEvent): void => {
        if (isDraggingMin || isDraggingMax) {
        const rect = rangeRef.current!.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newPercentage = (offsetX / rect.width) * 100;
        const newValue = min + ((newPercentage / 100) * (max - min));

        if (isDraggingMin) {
            if (newValue < min) {
                setMinValue(min);
            } else if (newValue >= maxValue) {
                setMinValue(maxValue - 1);
            } else {
                setMinValue(Math.round(newValue));
                setPrevMinStepValue(findValue(Math.round(newValue)))
            }
        } else if (isDraggingMax) {
            if (newValue > max) {
                setMaxValue(max);
            } else if (newValue <= minValue) {
                setMaxValue(minValue + 1);
            } else {
                setMaxValue(Math.round(newValue));
                setPrevMaxStepValue(findValue(Math.round(newValue)))
            }
        }
        }
    };

    const handleMouseUp = (): void => {
        setIsDraggingMin(false);
        setIsDraggingMax(false);
    };

    useEffect(() => {
        if (isDraggingMin || isDraggingMax) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingMin, isDraggingMax]);


    return (
        <div className={styles.rangeContainer} ref={rangeRef}>
            <div
                className={styles.rangeTrack}
                style={{
                left: `${getPercentage(minValueStep)}%`,
                right: `${100 - getPercentage(maxValueStep)}%`
                }}
            ></div>
            <div
                className={styles.rangeTrackBG}
            ></div>
            <div className={styles.rangeOfValuesTrackDotWrapper}>
                {
                    rangeOfValues.map((item, index)=> (
                        <span className={styles.rangeOfValuesTrackDot} style={{left:`${(((item-min)/(max-min))*100)}%`}} key={index}></span>
                    ))
                }
            </div>
            <div
                className={`${styles.rangeBullet} ${styles.min}`}
                ref={minBulletRef}
                style={{ left: `${getPercentage(minValueStep)}%` }}
                onMouseDown={() => setIsDraggingMin(true)}
            >
                <div className={styles.tooltip}>
                    {minValueStep}
                </div>
            </div>
            <div
                className={`${styles.rangeBullet} ${styles.max}`}
                ref={maxBulletRef}
                style={{ left: `${getPercentage(maxValueStep)}%` }}
                onMouseDown={() => setIsDraggingMax(true)}
            >
                <div className={styles.tooltip}>
                    {maxValueStep}
                </div>
            </div>
            <div className={styles.rangeLabels}>
                {
                    rangeOfValues.map((item, index)=> (
                        <span className={styles.rangeOfValuesLabel} style={{left:`${(((item-min)/(max-min))*100)}%`}} key={index}>{item}€</span>
                    ))
                }
            </div>
        </div>
    );
};

export default RangeOfValues;
