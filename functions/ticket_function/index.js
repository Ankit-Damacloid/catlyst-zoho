const express = require('express');
const catalystSDK = require('zcatalyst-sdk-node');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const catalyst = catalystSDK.initialize(req);
  res.locals.catalyst = catalyst;
  next();
});

//GET API. Get existing tasks if any from the server.
app.get('/all', async (req, res) => {
  try {
    const { catalyst } = res.locals;

    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);

    const zcql = catalyst.zcql();

    const hasMore = await zcql
      .executeZCQLQuery(`SELECT COUNT(ROWID) FROM ticket`)
      .then((rows) => parseInt(rows[0].ticket.ROWID) > page * perPage);

    //  ROWID, title, description, assign_to, status
    const ticket = await zcql
      .executeZCQLQuery(
        `SELECT * FROM ticket LEFT JOIN users ON ticket.assign_to = users.ROWID LIMIT  ${(page - 1) * perPage + 1
        },${perPage}`
      )
    console.log('ticket', ticket);
    // .then((rows) =>
    //   rows.map((row) => ({
    //     id: row.ticket.ROWID,
    //     title: row.ticket.title,
    //     description: row.ticket.description,
    //     assign_to: row.ticket.assign_to,
    //     status: row.ticket.status,
    //   }))
    // );

    res.status(200).send({
      status: true,
      data: {
        ticket,
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

// POST API. Contains the logic to create a task
app.post('/add', async (req, res) => {
  try {
    const { title, description, assign_to, status } = req.body;
    const { catalyst } = res.locals;

    const table = catalyst.datastore().table('ticket');

    const { ROWID: id } = await table.insertRow({
      title, description, assign_to: JSON.parse(assign_to).value, status: (status == "false" ? 0 : 1)
    });

    res.status(200).send({
      status: true,
      data: {
        todoItem: {
          id,
          title, description, assign_to, status,
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

// DELETE API. Contains the logic to delete a task.
app.delete('/:ROWID', async (req, res) => {
  try {
    const { ROWID } = req.params;
    const { catalyst } = res.locals;

    const table = catalyst.datastore().table('ticket');

    await table.deleteRow(ROWID);

    res.status(200).send({
      status: true,
      data: {
        ticket: {
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
