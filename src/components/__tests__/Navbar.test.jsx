import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

const renderNavbar = (ruta = '/inicio') =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('muestra el nombre de la marca', () => {
    renderNavbar();
    expect(screen.getByText('Sanos y Salvos')).toBeInTheDocument();
  });

  it('renderiza los enlaces principales de navegación', () => {
    renderNavbar();
    ['Inicio', 'Adopciones', 'Reportar', 'Donar', 'Nosotros'].forEach((texto) => {
      expect(screen.getByText(texto)).toBeInTheDocument();
    });
  });

  it('resalta el enlace activo según la ruta actual', () => {
    renderNavbar('/adopciones');
    const link = screen.getByText('Adopciones');
    expect(link.className).toContain('bg-[#1A365D]');
  });
});
