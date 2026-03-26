DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
TIMES = ["morning", "afternoon", "evening"]
BITS = 21

class Availability:

    def __init__(self, availability: dict):
        """
        Expects a dict like:
        {
            "monday":    {"morning": True, "afternoon": False, "evening": True},
            "tuesday":   {"morning": False, "afternoon": True, "evening": False},
            ...
        }
        Bit order: monday-morning is MSB, sunday-evening is LSB.
        """

        self.bits: int = 0
        for day in DAYS:
            for time in TIMES:
                self.bits <<= 1
                if availability.get(day, {}).get(time, False):
                    self.bits |= 1


    def to_dict(self) -> dict:
        '''
        Return a dictionary representation of the bits.

        Returns a dict like:
        {
            "monday":    {"morning": True, "afternoon": False, "evening": True},
            "tuesday":   {"morning": False, "afternoon": True, "evening": False},
            ...
        }
        '''
        result = {}
        mask = 1 << (BITS - 1)  # start at the MSB
        for day in DAYS:
            result[day] = {}
            for time in TIMES:
                result[day][time] = bool(self.bits & mask)
                mask >>= 1
        return result

    def __repr__(self):
        '''
        Return a string representation of the bits.
        '''
        return f"Availability(bits={self.bits:021b})"
