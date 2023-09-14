import { Request, Response } from "express";
import UserModel from "../models/User.model";
import { comparePassword, generarJWT } from "../utils";

class AuthController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async loginUsuario(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const usuario = await UserModel.findByEmail(email);

      if (!usuario) {
        return res.status(404).send({
          ok: false,
          msg: "El usuario no existe con ese email",
        });
      }

      // confirmar password

      const validPass = await comparePassword(password, usuario.password);


      if (!validPass) {
        return res.status(400).send({
          ok: false,
          msg: "Contraseña incorrecta",
        });
      }

      // generar JSON web token
      const token = await generarJWT(usuario.id, usuario.name);

      return res.status(200).send({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        ok: false,
        error: error,
      });
    }
  }
  async revalidarToken(req: Request, res: Response) {
    const token = await generarJWT(req.body.uid, req.body.name);
    res.json({ ok: true, uid: req.body.uid, name: req.body.name, token });
  }
}

export default new AuthController();
