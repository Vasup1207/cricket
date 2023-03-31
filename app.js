const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
module.exports = app;

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

/* GET players */

app.get("/players/", async (request, response) => {
  const convertDbObjectToResponseObject = (eachPlayer) => {
    return {
      playerId: eachPlayer.player_id,
      playerName: eachPlayer.player_name,
      jerseyNumber: eachPlayer.jersey_number,
      role: eachPlayer.role,
    };
  };
  const getPlayers = `
    SELECT
      *
    FROM
      cricket_team`;
  const playersList = await db.all(getPlayers);
  response.send(
    playersList.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

/* POST player */

app.post("/players/:playerId/", async (request, response) => {
  const convertDbObjectToResponseObject = (eachPlayer) => {
    return {
      playerId: eachPlayer.player_id,
      playerName: eachPlayer.player_name,
      jerseyNumber: eachPlayer.jersey_number,
      role: eachPlayer.role,
    };
  };

  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerList = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         '${role}'
      );`;

  await db.run(addPlayerList);

  response.send("Player Added to Team");
});

/* GET player */

app.get("/players/:playerId/", async (request, response) => {
  const convertDbObjectToResponseObject = (eachPlayer) => {
    return {
      playerName: eachPlayer.player_name,
      jerseyNumber: eachPlayer.jersey_number,
      role: eachPlayer.role,
    };
  };

  const { playerId } = request.params;
  const getPlayer = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  const playersList = await db.all(getPlayer);
  response.send(
    playersList.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

/* PUT player */

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number	=${jerseyNumber},
      role='${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

/* DELETE player */

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});



