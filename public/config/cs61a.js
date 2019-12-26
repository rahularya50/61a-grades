import {
    Assignment, range, Topic,
} from "./elements.js";

const BINS = [300, 285, 270, 250, 225, 205, 195, 185, 175, 170, 165, 160, 0];
const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

export const COURSE_CODE = "61A";

export const WARNING = `Please note that these scores are tentative and serve only as a rough guideline for your performance in the class. Grades listed here do not guarantee that assignment grade or final grade; we reserve the right to change these grades in the event of any mitigating circumstances (e.g., cheating, another violation of course policy, etc.) or errors in grading.
<br />
We will also be auditing these grades throughout the course of the semester - the Status Check is in a Beta version and there will likely be many issues with the grades displayed. <b>Do not count on these grades as fully accurate - again, this is intended to serve as a rough guideline for how you're doing in the class. If you spot a possible issue with any of your grades OR any bugs with the Status Check, please let us know using by emailing us at: <a href="mailto:cs61a+fa19@berkeley.edu">cs61a+fa19@berkeley.edu</a></b>`;


export const EXPLANATION = String.raw`https://cs61a.org/articles/about.html#grading`;
export const EXPLANATION_IS_LINK = true;

export const ENABLE_PLANNING = true;

window.COURSE_CODE = COURSE_CODE;
window.createAssignments = createAssignments;
window.canDisplayFinalGrades = canDisplayFinalGrades;
window.computeNeededFinalScore = computeNeededFinalScore;
window.participationProvided = participationProvided;
window.WARNING = WARNING;
window.EXPLANATION = EXPLANATION;
window.ENABLE_PLANNING = ENABLE_PLANNING;
window.EXPLANATION_IS_LINK = true;

export function createAssignments() {
    return [
        Topic("Raw Score", [
            Topic("Exams", [
                Assignment("Midterm 1 (Total)", 40),
                Assignment("Midterm 2 (Total)", 50),
                Assignment("Final", 75),
            ]),
            Topic("Homework", [
                ...range(1, 4).map(i => Assignment(`Homework ${i} (Total)`, 2)),
                Assignment("Homework 4 (Total)", 4),
                ...range(5, 11).map(i => Assignment(`Homework ${i} (Total)`, 2)),
                Assignment("Homework 11 (Total)", 3),
            ]),
            Topic("Projects", [
                Topic("Hog Project", [
                    Assignment("Hog (Total)", 23),
                    Assignment("Hog Checkpoint (Total)", 1),
                    Assignment("Hog (Composition)", 2),
                ]),
                Topic("Cats Project", [
                    Assignment("Cats (Total)", 18),
                    Assignment("Cats Checkpoint (Total)", 1),
                    Assignment("Cats (Composition)", 2),
                ]),
                Topic("Ants Project", [
                    Assignment("Ants (Total)", 30),
                    Assignment("Ants Checkpoint (Total)", 1),
                    Assignment("Ants (Composition)", 2),
                ]),
                Assignment("Scheme (Challenge ver.) (Total)", 29),
                Topic("Scheme Project", [
                    Assignment("Scheme (Total)", 28),
                    Assignment("Scheme Checkpoint (Total)", 1),
                ]),
            ]),
            Topic("Section Participation", [
                ...range(1, 13).map(i => Assignment(`Discussion ${i} (Total)`, 1)),
                ...range(1, 13).map(i => Assignment(`Lab ${i} (Total)`, 1)),
            ], 10),
        ]),
        Topic("Participation Credits (for midterm recovery)", [
            ...range(1, 13).map(i => Assignment(`Discussion ${i} (Total)`, 1)),
            ...range(1, 13).map(i => Assignment(`Lab ${i} (Total)`, 1)),
        ], 20),
    ];
}

export function canDisplayFinalGrades(scores) {
    const {
        Homework, Projects, "Midterm 1 (Total)": MT1, "Midterm 2 (Total)": MT2, "Section Participation": Participation,
    } = scores;
    return !Number.isNaN(Homework + Projects + Participation + MT1 + MT2);
}

export function computeNeededFinalScore(scores) {
    const {
        Homework, Projects, "Midterm 1 (Total)": MT1, "Midterm 2 (Total)": MT2, "Section Participation": Participation,
    } = scores;

    let { "Participation Credits (for midterm recovery)": Clobber } = scores;
    if (!Clobber) {
        Clobber = 0;
    }

    const totalNonFinal = Homework
                        + Projects
                        + Participation
                        + MT1
                        + MT2
                        + examRecover(MT1, Clobber, 40)
                        + examRecover(MT2, Clobber, 50);

    const needed = [];
    const grades = [];

    for (const [bin, i] of BINS.map((val, index) => [val, index])) {
        const neededScore = Math.max(0, bin - totalNonFinal);
        if (neededScore <= 75) {
            needed.push(`${neededScore} / 75`);
            grades.push(GRADES[i]);
        }
        if (neededScore === 0) {
            break;
        }
    }

    return [grades, needed];
}

function examRecover(examScore, participation, maxExamScore, cap = 20) {
    const halfScore = maxExamScore / 2;
    const maxRecovery = Math.max(0, (halfScore - examScore) / 2);
    const recoveryRatio = Math.min(participation, cap) / cap;
    return maxRecovery * recoveryRatio;
}

export function participationProvided(scores) {
    const { "Participation Credits (for midterm recovery)": Participation } = scores;
    return !Number.isNaN(Participation);
}
