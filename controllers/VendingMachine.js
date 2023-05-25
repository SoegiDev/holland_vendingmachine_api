module.exports.getAllBanner = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    console.log("message", from, to);
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        id: msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        attach: msg.message.attach,
        type: msg.message.file_type,
        size: msg.message.file_size,
        createdAt: msg.createdAt,
        read: msg.message.read,
        senderName: msg.senderName,
        senderPicture: msg.senderPicture,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
