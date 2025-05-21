import React, { useState, useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import sp500 from "../assets/sp500.json"

const API_KEY = "d0jmdq9r01qjm8s227m0d0jmdq9r01qjm8s227mg";
const BASE_URL = "https://finnhub.io/api/v1";

export default function StockInput({ value, onChange }) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
  
    const timeoutId = setTimeout(() => {
      // Elsőként lokális keresés
      const lcQuery = query.toLowerCase();

      const localMatches = sp500.filter(item =>
        (item.Security && item.Security.toLowerCase().includes(lcQuery)) ||
        (item.Symbol && item.Symbol.toLowerCase().startsWith(lcQuery))
      );
      
      
  
      if (localMatches.length > 0) {
        setSuggestions(localMatches);
      } else {
        // Ha nincs találat, hívjuk az API-t
        fetch(`${BASE_URL}/search?q=${query}&token=${API_KEY}`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data.result || []);
          })
          .catch(() => setSuggestions([]));
      }
    }, 300);
  
    return () => clearTimeout(timeoutId);
  }, [query]);
  

  const handleSelect = (symbol) => {
    setQuery(symbol);
    setSuggestions([]);
    setFocused(false); // bezárjuk a listát
    onChange(symbol);
    Keyboard.dismiss(); // bezárjuk a billentyűzetet is
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setFocused(false);
    }}>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Pl.: AAPL, MSFT"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {focused && query.length >= 1 && suggestions.length > 0 && (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={suggestions}
            keyExtractor={(item) => item.symbol}
            style={styles.suggestionList}
            renderItem={({ item }) => {
              const symbol = item.Symbol || 'N/A';
              const name = item.Security || 'N/A';
              const isPrimary = symbol && !symbol.includes('.');
              
            
              return (
                <TouchableOpacity onPress={() => handleSelect(symbol)}>
                  <Text style={[styles.suggestionItem, isPrimary && styles.primarySuggestion]}>
                    {symbol} - {name}
                  </Text>
                </TouchableOpacity>
              );
            }}
                 
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  suggestionList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  primarySuggestion: {
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#c4dbf5',
  },
   
});
