const { Session, ServiceProvider } = require('../models');

exports.getAllSessions = async (req, res) => {
    const sessions = await Session.findAll();
    res.json(sessions);
};



exports.createSession = async (req, res) => {
  try {
    // Create the session
    const { name, date, hall_name, startTime, endTime, serviceProviderIds } = req.body;

    const session = await Session.create({
      name,
      date,
      hall_name,
      startTime,
      endTime,
    });

    // // Set the associations
    // if (trainerIds && trainerIds.length > 0) {
    //   await session.addServiceProviders(trainerIds); // Link trainers as service providers
    // }

    if (serviceProviderIds && serviceProviderIds.length > 0) {
      await session.addServiceProviders(serviceProviderIds); // Link service providers
    }

    res.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Error creating session" });
  }
};


exports.getSessionById = async (req, res) => {
    const session = await Session.findByPk(req.params.id);
    res.json(session);
};

exports.updateSession = async (req, res) => {
    await Session.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Session updated' });
};

exports.deleteSession = async (req, res) => {
    await Session.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Session deleted' });
};
