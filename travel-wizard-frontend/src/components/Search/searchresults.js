import { useLocation, useNavigate } from 'react-router-dom';
import styles from "../Hotels/hotel.module.css";

function SearchResult() {
    const location = useLocation();
    const { destination } = location.state;
    const navigate = useNavigate(); // initialize useNavigate hook
    
    const goBack = () => {
        navigate('/search'); // use navigate method to go back to previous page
    };
    
    return (
        <>  
            <div className={styles.card}>
                <img alt='error' src={destination.image} class={styles.card__image} />
                <h2 className={styles.card__title}>{destination.name}</h2>
                <p className={styles.card__address}>Address: {destination.address}</p>
                <p className={styles.card__description}> Description:
                {destination.description.split('--').map((point, index) => (
                    <p key={index} className={styles.card__description}>{point.trim()}</p>
                ))}
                </p>

                {/* add button to go back */}
                <button onClick={goBack}>Back</button>
            </div>
        </>
    );
}

export default SearchResult;
