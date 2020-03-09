"use strict";

const Alert = use("App/Models/Alert");
const { validate } = use("Validator");

class AlertController {
  async store({ request, response, session }) {
    const validation = await validate(request.all(), {
      ["alert-title"]: "required|min:3|max:255"
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect("back");
    }

    const alert = new Alert();
    alert["alert-title"] = request.input("alert-title");
    await alert.save();

    session.flash({ notification: "Alert added!" });

    return response.redirect("back");
  }

  async destroy({ params, session, response }) {
    const task = await Alert.find(params.id);
    await task.delete();

    session.flash({ notification: "Alert deleted!" });

    return response.redirect("back");
  }
}

module.exports = AlertController;
