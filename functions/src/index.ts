import {setGlobalOptions, logger} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {fetch} from "undici";
// firebase deploy --only functions
setGlobalOptions({maxInstances: 10});
export const verifyTurnstileToken = onRequest(
  {cors: true},
  async (req, res) => {
    const {token} = req.body;
    const ip =
      req.headers["x-forwarded-for"]
        ?.toString()
        .split(",")[0]
        .trim() || req.socket.remoteAddress;

    if (!token) {
      logger.warn(`Không có token từ IP ${ip}`);
      res.status(400).json({error: "Thiếu token"});
      return;
    }

    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) {
      logger.error("Thiếu TURNSTILE_SECRET");
      res.status(500).json({error: "Cấu hình bị thiếu"});
      return;
    }

    try {
      const form = new URLSearchParams({secret, response: token});

      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          body: form.toString(),
        }
      );

      const result = (await verifyRes.json()) as { success: boolean };

      if (!result.success) {
        logger.warn(`Token không hợp lệ từ IP ${ip}`);
        res.status(403).json({error: "Xác minh thất bại"});
        return;
      }

      logger.info(`Token hợp lệ từ IP ${ip}`);
      res.status(200).json({success: true});
    } catch (err) {
      logger.error(`Lỗi xác minh CAPTCHA từ IP ${ip}:`, err);
      res.status(500).json({error: "Lỗi hệ thống khi xác minh CAPTCHA"});
    }
  }
);
