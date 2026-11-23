import styles from "./search-bar.module.css";
import searchIcon from "../../assets/figma/search.svg";

// Barra de busca branca do Figma ("O que você procura?")
export default function SearchBar({ value, onChange, onSubmit, placeholder = "O que você procura?" }) {
    return (
        <form
            className={styles.bar}
            role="search"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit?.();
            }}
        >
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                maxLength={100}
            />
            <button type="submit" aria-label="Pesquisar">
                <img src={searchIcon} alt="" width={24} height={24} />
            </button>
        </form>
    );
}
