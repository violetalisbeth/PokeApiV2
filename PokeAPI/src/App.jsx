// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
    const [pokemonName, setPokemonName] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [error, setError] = useState('');
    const [editingIndex, setEditingIndex] = useState(null); // Índice del Pokémon que se está editando
    const [editedPokemon, setEditedPokemon] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pokemonName.trim() === '') {
            setError('Ingresa un nombre o ID de Pokémon válido.');
            return;
        }

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`);
            if (!response.ok) {
                throw new Error('No encontrado');
            }
            const data = await response.json();
            setPokemonList(prevList => [...prevList, data]);
            setPokemonName('');
            setError('');
        } catch (error) {
            setError('Pokémon no encontrado, intenta con otro nombre o ID.');
        }
    };

    const handleEditPokemon = (index) => {
        const pokemonToEdit = pokemonList[index];
        setEditedPokemon({
            name: pokemonToEdit.name,
            height: pokemonToEdit.height,
            weight: pokemonToEdit.weight,
            abilities: pokemonToEdit.abilities.map(ability => ability.ability.name).join(', ')
        });
        setEditingIndex(index);
    };

    const handleUpdatePokemon = (index) => {
        const updatedList = [...pokemonList];
        updatedList[index] = {
            ...updatedList[index],
            name: editedPokemon.name,
            height: editedPokemon.height,
            weight: editedPokemon.weight,
            abilities: editedPokemon.abilities.split(',').map(ability => ({ ability: { name: ability.trim() } })),
        };
        setPokemonList(updatedList);
        setEditingIndex(null);
        setEditedPokemon({});
    };

    const handleDeletePokemon = (index) => {
        setPokemonList(prevList => prevList.filter((_, i) => i !== index));
    };

    return (
        <div className="container">
            <h1>Buscar Pokémon</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={pokemonName}
                    onChange={(e) => setPokemonName(e.target.value)}
                    placeholder="Nombre o ID del Pokémon"
                />
                <button type="submit">Buscar</button>
            </form>
            {error && <p>{error}</p>}
            <div id="pokemonInfo">
                {pokemonList.map((pokemon, index) => (
                    <div key={index} className="pokemon-card">
                        {editingIndex === index ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedPokemon.name}
                                    onChange={(e) => setEditedPokemon({ ...editedPokemon, name: e.target.value })}
                                    placeholder="Nombre"
                                />
                                <input
                                    type="number"
                                    value={editedPokemon.height}
                                    onChange={(e) => setEditedPokemon({ ...editedPokemon, height: e.target.value })}
                                    placeholder="Altura"
                                />
                                <input
                                    type="number"
                                    value={editedPokemon.weight}
                                    onChange={(e) => setEditedPokemon({ ...editedPokemon, weight: e.target.value })}
                                    placeholder="Peso"
                                />
                                <input
                                    type="text"
                                    value={editedPokemon.abilities}
                                    onChange={(e) => setEditedPokemon({ ...editedPokemon, abilities: e.target.value })}
                                    placeholder="Habilidades (separadas por comas)"
                                />
                                <button onClick={() => handleUpdatePokemon(index)}>Guardar Cambios</button>
                            </div>
                        ) : (
                            <>
                                <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                                <p><strong>ID:</strong> {pokemon.id}</p>
                                <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
                                <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
                                <p><strong>Habilidades:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                                <div className="crud-buttons">
                                    <button onClick={() => handleEditPokemon(index)}>Editar</button>
                                    <button onClick={() => handleDeletePokemon(index)}>Eliminar</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
