import React, { useState, useRef, useEffect } from 'react';
import styles from "@/styles/range.module.css";

interface RangeProps {
  min: number;
  max: number;
  initialMin: number;
  initialMax: number;
}

const Range: React.FC<RangeProps> = ({ min, max, initialMin, initialMax }) => {
    const [minValue, setMinValue] = useState<number>(initialMin);
    const [maxValue, setMaxValue] = useState<number>(initialMax);
    const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
    const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);
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
    },[])

    const getPercentage = (value: number): number => {
        return ((value - min) / (max - min)) * 100;
    };

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
                }
            } else if (isDraggingMax) {
                if (newValue > max) {
                    setMaxValue(max);
                } else if (newValue <= minValue) {
                    setMaxValue(minValue + 1);
                } else {
                    setMaxValue(Math.round(newValue));
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

    const handleLabelClick = (value: number, setValue: React.Dispatch<React.SetStateAction<number>>): void => {
        const newValue = parseInt(prompt("Enter new value:", value.toString()) || '');
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            if (setValue === setMinValue && newValue < maxValue) {
                setValue(newValue);
            } else if (setValue === setMaxValue && newValue > minValue) {
                setValue(newValue);
            }
        }
    };

    return (
        <div className={styles.rangeContainer} ref={rangeRef}>
            <div
                className={styles.rangeTrack}
                style={{
                left: `${getPercentage(minValue)}%`,
                right: `${100 - getPercentage(maxValue)}%`
                }}
            ></div>
            <div
                className={styles.rangeTrackBG}
            ></div>
            <div
                className={`${styles.rangeBullet} ${styles.min}`}
                ref={minBulletRef}
                style={{ left: `${getPercentage(minValue)}%` }}
                onMouseDown={() => setIsDraggingMin(true)}
            >
                <div className={styles.tooltip}>
                    {minValue}
                </div>
            </div>
            <div
                className={`${styles.rangeBullet} ${styles.max}`}
                ref={maxBulletRef}
                style={{ left: `${getPercentage(maxValue)}%` }}
                onMouseDown={() => setIsDraggingMax(true)}
            >
                <div className={styles.tooltip}>
                    {maxValue}
                </div>
            </div>
            <div className={styles.rangeLabels}>
                <span className={styles.rangeLabel} onClick={() => handleLabelClick(minValue, setMinValue)}>{min}€</span>
                <span className={styles.rangeLabel} onClick={() => handleLabelClick(maxValue, setMaxValue)}>{max}€</span>
            </div>
        </div>
    );
};

export default Range;
