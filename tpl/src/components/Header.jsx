import React from 'react'

const Header = () => {
    return (
        <header style={styles.header}>
            <h2>ThePortfolioLab</h2>
        </header>
    )
}

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    logo: {
        height: '40px',
        width: 'auto'
    }
}

export default Header