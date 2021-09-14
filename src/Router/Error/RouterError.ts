abstract class RouterError extends Error {
    public code: number;

    protected constructor(name: string, message: string, code: number) {
        super(message);
        this.name = name;
        this.code = code;
    }
}

export default RouterError;
