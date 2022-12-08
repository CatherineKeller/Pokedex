const database = require('./database');

const dataMapper = {
  getAllPokemons: async () => {
    const query = {
      text: 
      `
        SELECT *
        FROM "pokemon"
        ORDER BY "numero" ASC
      `,
    };
    
    const results = await database.query(query);
    return results.rows;
  },
  getOnePokemon: async (numero) => {
    const query = 
      `
        SELECT *
        FROM "pokemon"
        WHERE "numero" = $1
      `
    ;
      
    const result = await database.query(query, [numero]);
    
    if(result.rowCount === 1){
      return result.rows[0];
    }
  },
  // Pokemons par type
  getTypesPokemon: async (numero) => {
    const query = {
      text:
        `
          SELECT *
          FROM "type"
          INNER JOIN "pokemon_type" ON "type"."id" = "pokemon_type"."type_id"
          WHERE "pokemon_type"."pokemon_numero" = $1
        `,
      values: [numero]
    };

    const results = await database.query(query);
    return results.rows;
  },
  getAllTypes: async () => {
    const query =
    `
      SELECT *
      FROM "type"
      ORDER BY "name" ASC
    `;
    const results = await database.query(query);
    return results.rows;
  },
  getOneType: async (id) => {
    const query = 
      `
        SELECT *
        FROM "type"
        WHERE "id" = $1
      `
    ;
      
    const result = await database.query(query, [id]);
    
    if(result.rowCount === 1){
      return result.rows[0];
    }
  },
  getOneTypePokemons: async (id) => {
    const query = {
      text: 
      `
        SELECT *
        FROM "pokemon"
        INNER JOIN "pokemon_type" ON "pokemon"."numero" = "pokemon_type"."pokemon_numero"
        WHERE "pokemon_type"."type_id" = $1
      `,
      values: [id]
    };
    const results = await database.query(query);
    return results.rows;
  },
  search: async (string) => {
    const stringSearch = `%${string}%`;
    sql = 
    `
      SELECT "id", "nom", "numero"
      FROM "pokemon"
      WHERE "nom" ILIKE $1
      ORDER BY "nom" ASC
    `;
    const searchResults = await database.query(sql, [stringSearch]);
    return searchResults.rows;
  }
}

module.exports = dataMapper;
