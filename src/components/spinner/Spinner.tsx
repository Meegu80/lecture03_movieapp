import styles from "./Spinner.module.css";

interface SpinnerProps {
    size?: number;       // px 단위
    color?: string;      // 스피너 색상
    thickness?: number;  // 테두리 두께 px
}

const Spinner = ({
                     size = 40,
                     color = "#6366f1",
                     thickness = 4,
                 }: SpinnerProps) => {
    return (
        <div className={styles.wrapper}>
            <div
                className={styles.spinner}
                style={{
                    width: size,
                    height: size,
                    borderWidth: thickness,
                    borderTopColor: color,
                }}
            />
        </div>
    );
};

export default Spinner;