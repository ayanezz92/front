import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mascotasService } from '../mascotasService';

describe('mascotasService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('obtenerTodas hace un GET a /api/mascotas y devuelve el JSON', async () => {
    const mockData = [{ id: 1, nombre: 'Bobby', estado: 'Disponible' }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockData,
    });

    const result = await mascotasService.obtenerTodas();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/mascotas'),
      expect.objectContaining({ headers: expect.any(Object) })
    );
    expect(result).toEqual(mockData);
  });

  it('registrar envía un POST con el body serializado', async () => {
    const nuevaMascota = { nombre: 'Kira', especie: 'Gato' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ id: 2, ...nuevaMascota }),
    });

    const result = await mascotasService.registrar(nuevaMascota);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/mascotas'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(nuevaMascota),
      })
    );
    expect(result.id).toBe(2);
  });

  it('lanza un error cuando la respuesta no es ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(mascotasService.obtenerTodas()).rejects.toThrow(/500/);
  });
});
