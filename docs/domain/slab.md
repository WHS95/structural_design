# Concrete Slab Design Process

This document outlines the step-by-step process for designing a concrete slab, including necessary constants, variables, formulas, and expected outcomes.

---

## 1. Required Constants and Inputs

### Material Properties
- **Concrete compressive strength** (φ′): e.g., 30 MPa
  - From KDS 14 20 66, Section 4.2.3, Page 7.
- **Reinforcement yield strength** (φγ): e.g., 400 MPa
  - Based on typical structural steel properties (KDS 14 20 72, Section 3.1.2, Page 5).
- **Concrete modulus of elasticity** (Εᴄ): e.g., \( E_c = 4700 \sqrt{f_c'} \) (MPa)
  - Derived from empirical relationship in KDS 14 20 66, Page 8.
- **Unit weight of concrete** (ρ): Typically 24 kN/m³.
  - Referenced from standard values in KDS 14 20 72, Page 6.

### Design Loads
- **Self-weight of slab**: \( W_{self} = ρ \cdot thickness \).
  - Derived from material density (KDS 14 20 66, Page 9).
- **Live load**: External load applied during use.
  - Defined in KDS 14 20 72, Section 4.1, Page 10.
- **Dynamic load**: Includes vibrations, vehicles, or other moving loads.
  - Referenced from KDS 14 20 66, Page 11.
- **Environmental loads**: Wind, temperature effects, or seismic forces.
  - Referenced in KDS 14 20 72, Section 4.3, Page 12.

### Design Conditions
- **Span length** (ℓ): Distance between slab supports.
  - General design condition, not tied to specific standard section.
- **Deflection limits**: Based on building codes (e.g., \( L/240 \)).
  - Referenced from KDS 14 20 66, Section 5.2.1, Page 15.
- **Cover thickness** (ᶛ): Distance between reinforcement and slab surface.
  - As per KDS 14 20 72, Section 3.3.4, Page 8.

---

## 2. Design Variables

### Slab Thickness (h)
- Initial estimate: \( h = \frac{L}{20 \sim 30} \).
  - Rule of thumb from KDS 14 20 72, Section 4.2, Page 9.

### Reinforcement Ratio (ρ)
- \( \rho = \frac{A_s}{b \cdot d} \), where:
  - \( A_s \): Area of reinforcement.
  - \( b \): Width of the slab.
  - \( d \): Effective depth (distance from compression face to reinforcement centroid).
  - Defined in KDS 14 20 66, Section 6.1.3, Page 16.

---

## 3. Formulas and Calculations

### 1. **Flexural Strength Check**
- **Design bending moment** (μ):
  - \( M_u = \frac{w \cdot L^2}{8} \) (for simply supported slab).
  - Found in KDS 14 20 66, Section 4.4.1, Page 12.
- **Nominal moment resistance** (Μ):
  - \( M_r = ϕ \cdot A_s \cdot f_y \cdot (d - \frac{a}{2}) \), where:
    - \( a = \frac{A_s \cdot f_y}{0.85 \cdot f'_c \cdot b} \).
  - Based on KDS 14 20 72, Section 5.1.2, Page 14.

### 2. **Shear Strength Check**
- **Design shear force** (ν):
  - \( V_u = \frac{w \cdot L}{2} \).
  - Derived from static equilibrium, referenced in KDS 14 20 66, Section 4.5, Page 13.
- **Concrete shear strength**:
  - \( V_c = 0.17 \cdot \sqrt{f_c'} \cdot b \cdot d \) (for MPa).
  - From KDS 14 20 72, Section 5.2.1, Page 15.

### 3. **Deflection Check**
- Deflection formula:
  - \( \Delta = \frac{5 \cdot w \cdot L^4}{384 \cdot E_c \cdot I} \), where:
    - \( I = \frac{b \cdot h^3}{12} \) (moment of inertia).
  - Found in KDS 14 20 66, Section 6.4.2, Page 18.

### 4. **Reinforcement Area Calculation**
- Required reinforcement area:
  - \( A_s = \frac{M_u}{ϕ \cdot f_y \cdot (d - \frac{a}{2})} \).
  - Referenced in KDS 14 20 72, Section 5.3, Page 16.

---

## 4. Expected Outputs

### Results
1. **Slab Thickness (h)**
   - Initial and final thickness after iterations.
2. **Reinforcement Area (A_s)**
   - Required reinforcement for flexural strength.
3. **Deflection (δ)**
   - Deflection value compared to allowable limits.
4. **Safety Check Results**
   - Flexural, shear, and deflection criteria met or adjustments required.

---

## 5. Example: Simply Supported Slab Design

### Given Data:
- \( f_c' = 30 \, MPa, f_y = 400 \, MPa \).
- Span \( L = 6 \, m \).
- Load \( w = 5 \, kN/m^2 \).

### Steps:
1. **Slab Thickness**:
   - \( h = \frac{6000}{20} = 300 \, mm \).

2. **Self-Weight Calculation**:
   - \( W_{self} = 24 \cdot 0.3 = 7.2 \, kN/m^2 \).

3. **Flexural Moment**:
   - \( M_u = (5 + 7.2) \cdot 6^2 / 8 = 54 \, kN \cdot m \).

4. **Reinforcement Area**:
   - \( A_s = \frac{M_u}{ϕ \cdot f_y \cdot d} \).

---

For further calculations or adjustments based on standards, refer to the relevant KDS documentation.
