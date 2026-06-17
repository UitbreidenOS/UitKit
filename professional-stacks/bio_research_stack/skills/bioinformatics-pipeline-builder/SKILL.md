---
name: bioinformatics-pipeline-builder
description: Designs and documents bioinformatics analysis pipelines for genomics, transcriptomics, and proteomics data. Outputs reproducible pipeline definitions with tool versions, parameters, and quality control checkpoints.
allowed-tools: Read, Write, Bash
effort: high
---

# Bioinformatics Pipeline Builder

## When to activate
When processing sequencing data (RNA-seq, WGS, ChIP-seq, ATAC-seq, scRNA-seq), building analysis workflows, or when optimizing existing pipelines. Use for any NGS data processing task.

## When NOT to use
Skip for simple BLAST searches, single-gene analysis, or when using a validated, unchanged pipeline on routine data.

## Instructions

1. **Define the analysis:**
   - Data type: RNA-seq, WGS, WES, ChIP-seq, ATAC-seq, scRNA-seq, metagenomics
   - Organism and genome build (GRCh38, mm39, etc.)
   - Sequencing platform and read length
   - Research question and expected output

2. **Pipeline stages:**
   - **QC:** FastQC, MultiQC, adapter trimming (Trim Galore/fastp)
   - **Alignment:** STAR/HISAT2 (RNA-seq), BWA-MEM2 (DNA-seq), Cell Ranger (scRNA-seq)
   - **Processing:** Sort, index, dedup (Picard/samtools), strand-specific handling
   - **Quantification:** featureCounts/Salmon (RNA-seq), GATK (variants), MACS2 (ChIP-seq)
   - **Downstream:** DESeq2/edgeR (DE), clusterProfiler (GSEA), Seurat/Scanpy (scRNA-seq)

3. **Quality checkpoints:**
   - Post-QC: Reads passing filter, adapter content, per-base quality
   - Post-alignment: Mapping rate (>80%), multi-mapping rate, insert size
   - Post-quantification: Gene detection (>1 CPM in ≥X samples), library complexity

4. **Reproducibility requirements:**
   - Tool versions (exact, not "latest")
   - Container images (Docker/Singularity)
   - Parameter files (YAML/JSON)
   - Random seeds where applicable

5. **Resource estimation:**
   - RAM, CPU, disk per sample
   - Estimated runtime
   - Parallelization strategy

## Output Format

```
PIPELINE: [Name] — [Data type]
GENOME: [Build] | ANNOTATION: [GTF/GFF source]
PLATFORM: [Illumina NovaSeq/PacBio/etc.] | READ: [PE150/SE75/etc.]

STAGES:
  1. QC: [tool] v[version] — [parameters]
     CHECKPOINT: [threshold]
  2. Alignment: [tool] v[version] — [parameters]
     CHECKPOINT: Mapping rate ≥[X]%
  3. [Processing steps]
  4. Quantification: [tool] v[version]
     CHECKPOINT: [threshold]
  5. Downstream: [tool/method]

RESOURCES:
  Per sample: [X] GB RAM, [Y] CPU, [Z] GB disk
  Estimated total: [time]

REPRODUCIBILITY:
  Container: [Docker image:tag]
  Parameters: [config file path]
  Seed: [value where applicable]
```

## Example

```
PIPELINE: Differential Gene Expression — Bulk RNA-seq
GENOME: GRCh38 (GENCODE v44) | ANNOTATION: gencode.v44.annotation.gtf
PLATFORM: Illumina NovaSeq 6000 | READ: PE150

STAGES:
  1. QC: FastQC v0.12.1 + MultiQC v1.14
     CHECKPOINT: Per-base quality ≥Q30, adapter content <5%
  2. Trimming: Trim Galore v0.6.10 --paired --quality 20 --length 50
  3. Alignment: STAR v2.7.11a --outSAMstrandField intronMotif --quantMode GeneCounts
     CHECKPOINT: Mapping rate ≥85%, uniquely mapped ≥70%
  4. Quantification: Salmon v1.10.1 (alignment-based mode)
     CHECKPOINT: ≥10,000 genes detected (>1 CPM in ≥3 samples)
  5. DE Analysis: DESeq2 v1.42.0, Wald test, BH correction
     CHECKPOINT: |log2FC| ≥ 1, padj < 0.05
  6. Enrichment: clusterProfiler v4.10.0, GO + KEGG

RESOURCES:
  Per sample: 32 GB RAM, 8 CPU, 50 GB disk
  Estimated total: ~4h for 24 samples

REPRODUCIBILITY:
  Container: biocontainers/star:2.7.11a
  Parameters: config/rnaseq-pipeline.yaml
```
