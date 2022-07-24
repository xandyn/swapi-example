import axios, { AxiosError, AxiosResponse } from "axios";
import { isRight } from "fp-ts/Either";
import { flow, pipe } from "fp-ts/function";
import * as IT from "io-ts";
import reporter from "io-ts-reporters";

/** Интерфейс валидатора. Метод check возвращает значение ожидаемого типа, либо бросает ошибку, если переданное
 *  значение ему не соответствует.  */
export type Validator<T> = {
  check: (value: unknown) => T;
};

/**
 * Фабрика валидаторов на основе типов (кодеков) io-ts
 */
export const createITValidator = <T>(ttype: IT.Type<T>) => ({
  check: (value: unknown) =>
    pipe(ttype.decode(value), (decodedValue) => {
      if (isRight(decodedValue)) {
        return decodedValue.right;
      }
      throw new Error(
        reporter.report(decodedValue, { truncateLongTypes: false }).join("\n")
      );
    })
});

export const NetworkDataErrorsIT = IT.type({
  errors: IT.union([
    IT.array(
      IT.type({
        code: IT.number,
        messageKey: IT.string,
        params: IT.type({ description: IT.string })
      })
    ),
    IT.null
  ])
});

const NetworkDataErrorsValidator = createITValidator(NetworkDataErrorsIT);

/** Ошибка бекенда */
export type NetworkDataErrors = IT.TypeOf<typeof NetworkDataErrorsIT>;

/** Сетевой ответ */
export type NetworkResponse<T = unknown> = AxiosResponse<T | NetworkDataErrors>;

const NetworkResponseIT = IT.intersection([
  IT.type({
    data: IT.unknown,
    status: IT.number,
    statusText: IT.string,
    headers: IT.unknown,
    config: IT.type({})
    // AxiosRequestConfig
  }),
  IT.partial({ request: IT.unknown })
]);

const NetworkResponseValidator = createITValidator(NetworkResponseIT);

/** Сетевой ответ
 * Создает Validator сетевого ответа, для валидации данных в котором используется dataValidator.
 * Успешная валидация означает, что объект является корректным объектом сетевого ответа, а его поле data соответствует либо
 * NetworkDataErrorsValidator, либо переданному dataValidator. */
export const NetworkResponseRTG = <T>(dataValidator: Validator<T>) => ({
  check: (resp: NetworkResponse) => {
    try {
      NetworkResponseValidator.check(resp);
    } catch (e) {
      e.config = resp.config;
      throw e;
    }
    try {
      return {
        ...resp,
        data: NetworkDataErrorsValidator.check(resp.data)
      };
    } catch {
      try {
        return {
          ...resp,
          data: dataValidator.check(resp.data)
        };
      } catch (e) {
        e.config = resp.config;
        throw e;
      }
    }
  }
});

/** Вспомогательная утилита для создания валидатора сетевого ответа непосредстенно из типа io-ts */
export const createITNetworkResponseValidator = flow(
  createITValidator,
  NetworkResponseRTG
);

/** Сетевая ошибка */
export type NetworkError = AxiosError;
export const isNetworkError = (error: unknown): error is NetworkError =>
  axios.isAxiosError(error);

export const AxiosErrorResponseIT = IT.type({
  timestamp: IT.string,
  status: IT.number,
  error: IT.string,
  message: IT.string,
  path: IT.string
});

export type AxiosErrorResponse = IT.TypeOf<typeof AxiosErrorResponseIT>;

export const isAxiosResponse = <T>(response): response is AxiosResponse<T> =>
  response !== null &&
  typeof response === "object" &&
  "data" in response &&
  "status" in response;
