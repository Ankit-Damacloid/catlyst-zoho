const express = require('express');
const bcrypt = require('bcryptjs');
const catalystSDK = require('zcatalyst-sdk-node');
const { compareCredentials, hashPassword } = require("./utills")
const JWT = require("./auth")
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const catalyst = catalystSDK.initialize(req);
  res.locals.catalyst = catalyst;
  next();
});

app.post('/login', async (req, res) => {
  try {
    console.log('req.body login', req.body);
    const { password, email } = req.body;
    const { catalyst } = res.locals;
    const zcql = catalyst.zcql();

    //check if user exits or not
    const userFound = await zcql
      .executeZCQLQuery(`select * from users where email = '${email}'`);
    console.log("userFound -> ", userFound)
    if (!Boolean(userFound.length)) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const userObj = userFound[0].users;

    const hasPasswordMatched = await compareCredentials(password, userObj.password)
    console.log("hasPasswordMatched -> ", hasPasswordMatched)
    if (!Boolean(hasPasswordMatched)) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = JWT.generateJwtToken(userObj)

    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 100),
        secure: false,
        httpOnly: true,
        sameSite: "Strict",
      })
    return res.status(200).send({
      status: true,
      data: {
        user: userObj,
        token
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: false,
      message: "We're unable to process the request.",
    });
  }
});


//GET API. Get existing tasks if any from the server.
app.get('/all', async (req, res) => {
  try {
    const { catalyst } = res.locals;

    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);

    const zcql = catalyst.zcql();

    const hasMore = await zcql
      .executeZCQLQuery(`SELECT COUNT(ROWID) FROM users`)
      .then((rows) => parseInt(rows[0].users.ROWID) > page * perPage);

    const userRes = await zcql
      .executeZCQLQuery(
        `SELECT ROWID,name, email, role FROM users LIMIT  ${(page - 1) * perPage + 1
        },${perPage}`
      )
      .then((rows) =>
        rows.map((row) => ({
          id: row.users.ROWID,
          name: row.users.name,
          email: row.users.email,
          role: row.users.role
        }))
      );

    res.status(200).send({
      status: true,
      data: {
        userRes,
        hasMore,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: false,
      message: "We're unable to process the request.",
    });
  }
});

// POST API. Contains the logic to create user
app.post('/add', async (req, res) => {
  try {
    console.log('req.body add', req.body);
    const { name, email } = req.body;
    let { password, role } = req.body;
    const { catalyst } = res.locals;

    if (!role) role = 2;

    const table = catalyst.datastore().table('users');
    const zcql = catalyst.zcql();

    //check if user exits or not
    const userExists = await zcql
      .executeZCQLQuery(
        `SELECT ROWID,name, email, role FROM users Where email = '${email}'`
      )
    console.log(" user exist ", userExists)
    if (Boolean(userExists.length)) {
      return res.status(401).send({
        success: false,
        message: "Email address already taken",
      });
    }
    const hashedPassword = await hashPassword(password);

    const response = await table.insertRow({
      name, email, password: hashedPassword, role
    });

    console.log('response-', response);

    const token = JWT.generateJwtToken(response)
    res.status(200).send({
      status: true,
      data: {
        user: response,
        token
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: false,
      message: "We're unable to process the request.",
    });
  }
});

// DELETE API. Contains the logic to delete a task.
app.delete('/:ROWID', async (req, res) => {
  try {
    const { ROWID } = req.params;
    const { catalyst } = res.locals;

    const table = catalyst.datastore().table('Users');

    await table.deleteRow(ROWID);
    await table.get;

    res.status(200).send({
      status: true,
      data: {
        user: {
          id: ROWID,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: false,
      message: "We're unable to process the request.",
    });
  }
});

module.exports = app;
