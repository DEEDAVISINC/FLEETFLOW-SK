# 🔍 FleetFlow Identifiers - Quick Reference Card

## **📞 PHONE REFERENCE NUMBERS**

- **Board #**: `100001` → Use for all phone calls
- **Lookup**: Board # → Load ID → BOL → Invoice

## **📋 LOAD IDENTIFIERS**

| Type         | Format                        | Example                       | Use             |
| ------------ | ----------------------------- | ----------------------------- | --------------- |
| **Board #**  | `100001`                      | `100001`                      | Phone reference |
| **Load ID**  | `MJ-25015-LAXPHX-SMP-DVF-001` | `MJ-25015-LAXPHX-SMP-DVF-001` | Full tracking   |
| **BOL #**    | `BOL-{Core}-{Seq}`            | `BOL-MJ25015-001`             | Shipping docs   |
| **Internal** | `L-001`                       | `L-001`                       | Database ref    |

## **🧾 INVOICE IDENTIFIERS**

- **Format**: `INV-{Dept}-{Initials}-{Core}`
- **Dispatcher**: `INV-DC-SJ-MJ25015-001`
- **Broker**: `INV-BB-ED-MJ25015-001`

## **👥 USER IDENTIFIERS**

- **Format**: `{Initials}-{Dept}-{HireDate}`
- **Example**: `SJ-DC-2023005`
- **Departments**: DC (Dispatcher), BB (Broker), DM (Driver), MGR (Manager)

## **🔗 SYSTEM FLOW**

```
Load: MJ-25015-LAXPHX-SMP-DVF-001
  ↓
BOL: BOL-MJ25015-001
  ↓
Invoice: INV-DC-SJ-MJ25015-001
  ↓
Board #: 100001 (phone)
```

## **📞 CUSTOMER SERVICE SCRIPT**

**Customer**: "Load board number 100001" **You**: "Board #100001 is load
MJ-25015-LAXPHX-SMP-DVF-001, BOL-MJ25015-001"

---

_For complete guide see: FLEETFLOW_IDENTIFIER_SYSTEMS_GUIDE.md_
