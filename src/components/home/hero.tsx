import React from 'react';
import styles from './hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to Our Service</h1>
                <p className={styles.subtitle}>Schedule your appointments with ease</p>
            </div>
        </section>
    );
};

export default Hero;