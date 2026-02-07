import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            uid?: string;
            email?: string;
        }
    }
}
export declare function verifyFirebaseToken(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map