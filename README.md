# TEST-Ricette

Questo progetto è una semplice applicazione web per la gestione delle ricette, progettata per mostrare due diversi approcci di sviluppo JavaScript: uno classico e uno OOP (Object-Oriented Programming).

## Come funziona

L'applicazione si basa su un file di dati `data.json` che contiene l'elenco delle ricette e utilizza [json-server](https://github.com/typicode/json-server) per simulare una REST API locale.

### Avvio del server dati

Per far funzionare l'applicazione, è necessario avviare `json-server` puntando al file `data.json`. Assicurati di avere [Node.js](https://nodejs.org/) installato, poi esegui:

```bash
npm install -g json-server
json-server --watch data.json
```

Questo comando avvierà il server sulla porta predefinita (solitamente `http://localhost:3000`).

### Come usare l'applicazione

Apri il file `index.html` in un browser. All'interno del file troverai due tag `<script>`, ognuno dei quali include uno dei due fogli JavaScript:

```html
<script src="script.js"></script>
<!-- <script src="oop.js"></script> -->
```

- **script.js:** Implementa la logica dell'applicazione con un approccio tradizionale (procedurale).
- **oop.js:** Implementa la stessa logica, ma con un approccio orientato agli oggetti (OOP).

Solo uno dei due script deve essere attivo alla volta. Per usare la versione OOP, basta commentare il tag `<script src="script.js"></script>` e decommentare `<script src="oop.js"></script>`, oppure viceversa.

### Riepilogo

- Avvia `json-server` su `data.json`
- Scegli quale file JavaScript utilizzare modificando i tag `<script>` in `index.html`
- Apri `index.html` nel browser per utilizzare l'applicazione

## Note

- Entrambe le versioni dell'applicazione funzionano allo stesso modo dal punto di vista dell'utente finale, ma la struttura del codice è differente, per mostrare i vantaggi e le differenze tra i due approcci.
- Puoi modificare o estendere `data.json` per aggiungere nuove ricette o adattare i dati alle tue esigenze.

---
**Autore:** Glitch-dn
