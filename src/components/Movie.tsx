import type {MovieItem} from "./Home.tsx";
import {Link} from "react-router";
import styles from "../styles/Movie.module.css";

const Movie = ({ movie }: { movie: MovieItem }) => {

// 렌더링 파트(JSX & TSX = 태그를 사용할 수 있게해주는 구간)=================================================================== 
    return (
        <Link to={`/movie/${movie["#IMDB_ID"]}`} className={styles.movie}>
            <div className={styles.poster_container}>
                <img className={styles.poster} src={movie["#IMG_POSTER"]} alt={movie["#TITLE"]}/>
            </div>
            <div className={styles.movie_info}>
                <h2 className={styles.movie_title}>{movie["#TITLE"]}</h2>
                <div className={styles.meta_info}>
                    <span className={styles.movie_year}>{movie["#YEAR"]}</span>
                    <span className={styles.rank}>Rank #{movie["#RANK"]}</span>
                </div>
                <p className={styles.actors}>{movie["#ACTORS"]}</p>
            </div>
        </Link>
    )
}

export default Movie;