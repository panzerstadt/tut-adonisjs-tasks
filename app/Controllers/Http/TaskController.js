"use strict";

const Alert = use("App/Models/Alert");
const Task = use("App/Models/Task");
const { validate } = use("Validator");

class TaskController {
  async index({ view }) {
    const tasks = await Task.all();
    const alerts = await Alert.all();

    return view.render("tasks.index", {
      tasks: tasks.toJSON(),
      alerts: alerts.toJSON()
    });
  }

  async store({ request, response, session }) {
    const validation = await validate(request.all(), {
      title: "required|min:3|max:255"
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect("back");
    }

    const task = new Task();
    task.title = request.input("title");
    await task.save();

    session.flash({ notification: "Task added!" });

    return response.redirect("back");
  }

  async destroy({ params, session, response }) {
    const task = await Task.find(params.id);
    await task.delete();

    session.flash({ notification: "Task deleted!" });

    return response.redirect("back");
  }
}

module.exports = TaskController;
