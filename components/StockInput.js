import React, { useState, useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme 
} from 'react-native';
import sp500 from "../assets/sp500.json"

// Az API hívás logikája változatlan
const API_KEY = "kCkgQOjqMBI4Jhkchxn5FsJOQiNulc7Q"; // <<< Használd a saját kulcsodat!
const BASE_URL = "https://financialmodelingprep.com/api/v3";

const getStyles = (theme, colorScheme) => {
  const isDarkMode = colorScheme === 'dark';

  return StyleSheet.create({
    input: {
      borderWidth: 1.5,
      // 3. Itt történik a felülírás a kérésednek megfelelően
      borderColor: isDarkMode ? '#E0E0E0' : '#151719', // Törtfehér sötét módban, fekete világos módban
      padding: 12,
      borderRadius: 10,
      marginBottom: 4,
      color: theme.inputText,
      backgroundColor: theme.inputBackground,
      fontSize: 16,
      color:  isDarkMode ? '#E0E0E0' : '#151719',
    },
    suggestionList: {
      maxHeight: 150,
      borderWidth: 1,
      borderColor: isDarkMode ? '#E0E0E0' : '#E0E0E0',
      borderRadius: 10,
      backgroundColor: isDarkMode ? '#E0E0E0' : '#E0E0E0',
      shadowColor: "#fff",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 8,
    },
    suggestionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.suggestionSeparator,

    },
    primarySuggestion: {
      fontWeight: 'bold',
      color: theme.primarySuggestionText,
      backgroundColor: theme.primarySuggestionBackground,
      color: isDarkMode ? '#151719' : '#151719',
    },
  });
};

export default function StockInput({ value, onChange, theme }) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const colorScheme = useColorScheme();
  const styles = getStyles(theme, colorScheme);

  // <<< JAVÍTÁS ITT TÖRTÉNT >>>
  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
  
    // Az onChange-t ne itt hívd, mert az App.js-ben a handleStockChange
    // state-et állít, ami felesleges re-rendert okoz gépelés közben.
    // Elegendő, ha a kiválasztáskor és a gépeléskor (onChangeText) hívjuk.
    
    const timeoutId = setTimeout(() => {
      const lcQuery = query.toLowerCase();

      // Helyi keresés az sp500.json-ban
      const localMatches = sp500.filter(item =>
        (item.Security && item.Security.toLowerCase().includes(lcQuery)) ||
        (item.Symbol && item.Symbol.toLowerCase().startsWith(lcQuery))
      );

      // Ha van helyi találat, azt mutatjuk. Ha nincs, akkor hívjuk az API-t.
      if (localMatches.length > 0) {
        setSuggestions(localMatches.slice(0, 10)); // Limitáljuk a találatokat
      } else {
        // API hívás, ha nincs helyi találat
        fetch(`${BASE_URL}/search-ticker?query=${query}&limit=10&apikey=${API_KEY}`)
          .then((res) => res.json())
          .then((data) => {
            // A FMP API néha 'result' kulcsot ad, néha csak egy tömböt.
            setSuggestions(data.result || data || []); 
          })
          .catch(() => setSuggestions([]));
      }
    }, 300); // Debounce idő
  
    return () => clearTimeout(timeoutId);
  }, [query]); // A függőség helyes, csak a query-től függ.

  const handleSelect = (item) => {
    const symbol = item.Symbol || item.symbol;
    const name = item.Security || item.name || 'Név nem elérhető';
    const fullText = `${symbol} - ${name}`;
    
    setQuery(fullText); // A beviteli mezőbe a teljes szöveg kerül
    setSuggestions([]); // Lista elrejtése
    setFocused(false); // Fókusz elvétele
    onChange(item); // Az App.js-nek átadjuk a kiválasztott objektumot
    Keyboard.dismiss(); // Billentyűzet elrejtése
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setFocused(false);
      setSuggestions([]); // Kattintáskor a javaslatok is tűnjenek el
    }}>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Pl.: AAPL, MSFT"
          placeholderTextColor={theme.placeholder}
          value={query}
          onChangeText={text => {
            setQuery(text);
            // Itt fontos, hogy az onChange-et is meghívjuk, hogy ha a felhasználó
            // csak beírja a tickert (pl. "TSLA") és nem választ a listából,
            // az App.js akkor is megkapja az értéket.
            onChange(text); 
          }}
          onFocus={() => setFocused(true)}
        />
        {focused && query.length >= 1 && suggestions.length > 0 && (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={suggestions}
            keyExtractor={(item, index) => `${item.symbol || item.Symbol}-${index}`}
            style={styles.suggestionList}
            renderItem={({ item }) => {
              const symbol = item.symbol || item.Symbol || 'N/A';
              const name = item.name || item.Security || 'N/A';
              const isPrimary = symbol && !symbol.includes('.');
              
              return (
                <TouchableOpacity onPress={() => handleSelect(item)}>
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