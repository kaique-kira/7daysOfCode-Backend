class ResponsePayload {
  code: number;
  payload: any;

  constructor(code: number, payload: any) {
    this.code = code;
    this.payload = payload;
  }
}

export const respondWithCode = (
  code: number,
  payload: any
): ResponsePayload => {
  return new ResponsePayload(code, payload);
};

export const writeJson = (
  response: any,
  arg1: any,
  arg2?: any,
  id_usuario: string | null = null
): boolean => {
  let code: number;
  let payload: any;

  // Se o primeiro argumento for uma instância de ResponsePayload, processe-o
  if (arg1 instanceof ResponsePayload) {
    return writeJson(response, arg1.payload, arg1.code, id_usuario);
  }

  // Determina o código de status
  if (arg2 && Number.isInteger(arg2)) {
    code = arg2;
  } else if (arg1 && Number.isInteger(arg1)) {
    code = arg1;
  } else {
    code = 200; // Código padrão
  }

  // Determina o payload
  if (code && arg1) {
    payload = arg1;
  } else if (arg1) {
    payload = arg1;
  }

  // Converte o payload para JSON, se for um objeto
  if (typeof payload === "object") {
    payload = JSON.stringify(payload, null, 2);
  }

  // Define os cabeçalhos da resposta
  const headers: Record<string, string> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Content-Type": "application/json",
  };

  if (id_usuario) {
    headers["API-OAUTH-METADATA-FOR-ACCESSTOKEN"] = id_usuario;
  }

  // Envia a resposta
  response.writeHead(code, headers);
  response.end(payload);

  return true; // Indica que a resposta foi enviada com sucesso
};

export const returnResponse = (response: any, statusCode: number) => {
  return {
    response,
    statusCode,
  };
};
