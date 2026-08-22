import assert from "node:assert/strict";
import test from "node:test";
import { loadDistritoFederalComponents } from "./data.js";

const components = loadDistritoFederalComponents();

test("carrega apenas os 15 componentes do Distrito Federal", () => {
  assert.equal(components.length, 15);
});

test("converte Sem progresso em zero e calcula F3 na escala de 0 a 4", () => {
  const component = components.find(
    (item) => item.componentIdentifier === "F3",
  );
  assert.ok(component);
  assert.equal(component.componentName, "Mobilização de investimentos privados");
  assert.equal(component.score, 0);
  assert.equal(component.eligible, true);
});

test("calcula a média dos itens e mapeia o nome do componente", () => {
  const component = components.find(
    (item) => item.componentIdentifier === "P1",
  );
  assert.ok(component);
  assert.equal(component.componentName, "Estratégias de mitigação");
  assert.equal(component.score, 0.89);
  assert.equal(component.calculation.evaluatedItems, 3);
});

test("não transforma componente com item Não avaliado em nota zero", () => {
  const component = components.find(
    (item) => item.componentIdentifier === "G7",
  );
  assert.ok(component);
  assert.equal(component.status, "nao_avaliado");
  assert.equal(component.score, null);
  assert.equal(component.eligible, false);
});
